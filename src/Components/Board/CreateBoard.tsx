import type { statusType } from '../../Common/utils'

import loadable from '@loadable/component'
import { IconButton } from '@mui/material'
import { navigate } from 'raviger'
import { useCallback, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Close } from '@mui/icons-material'

import useWindowDimensions from '../../Common/hooks/useWindowDimensions'
import { useAbortableEffect } from '../../Common/utils'
import { createBoard, updateBoard, getBoard } from '../../Redux/actions'
import * as Notification from '../../Utils/Notification.js'
import Modal from '../Common/Modal'
import { Board } from '../../types/task'
import Button from '../Common/Button'
import { FieldChangeEvent } from '../Common/Form/FormFields/Utils'
import TextFormField from '../Common/Form/FormFields/TextFormField'

const Loading = loadable(() => import('../Common/Loading'))

const initForm: Board = {
  title: '',
  description: ''
}

const initError: Record<keyof Board, string> = Object.assign(
  {},
  ...Object.keys(initForm).map((k) => ({ [k]: '' }))
)

const initialState = {
  errors: { ...initError },
  form: { ...initForm }
}

type SetFormAction = { type: 'set_form'; form: Board }
type SetErrorAction = {
  type: 'set_error'
  errors: Record<keyof Board, string>
}
type BoardCreateFormAction = SetFormAction | SetErrorAction

const activity_reducer = (state = initialState, action: BoardCreateFormAction) => {
  switch (action.type) {
    case 'set_form':
      return { ...state, form: action.form }
    case 'set_error':
      return { ...state, errors: action.errors }
  }
}

type CreateBoardProps = {
  boardId?: string
}

export const CreateBoard = (props: CreateBoardProps) => {
  const dispatchAction: any = useDispatch()
  const { boardId } = props
  const [stateForm, dispatch] = useReducer(activity_reducer, initialState)
  const [openBoard, setOpenBoard] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { width } = useWindowDimensions()

  const headerText = !boardId ? 'Create Board' : 'Update Board'
  const buttonText = !boardId ? 'Save Board' : 'Update Board'

  const fetchData = useCallback(
    async (status: statusType) => {
      if (boardId) {
        setIsLoading(true)
        const res = await dispatchAction(getBoard(boardId))

        if (!status.aborted && res.data) {
          const formData = {
            title: res.data.title,
            description: res.data.description
          }

          dispatch({ form: formData, type: 'set_form' })
        } else {
          navigate(`/boards`)
        }
        setIsLoading(false)
      }
    },
    [boardId, dispatchAction]
  )

  useAbortableEffect(
    (status: statusType) => {
      if (boardId) {
        fetchData(status)
      }
    },
    [dispatch, fetchData]
  )

  const handleValueChange = (value: any, field: string) => {
    dispatch({
      form: { ...stateForm.form, [field]: value },
      type: 'set_form'
    })
  }

  const handleFormFieldChange = (event: FieldChangeEvent<string>) => {
    dispatch({
      form: {
        ...stateForm.form,
        [event.name]: event.value
      },
      type: 'set_form'
    })
  }

  const validateForm = () => {
    const errors = { ...initError }
    let invalidForm = false

    Object.keys(stateForm.form).forEach((field) => {
      switch (field) {
        case 'title':
        case 'description':
          if (!stateForm.form[field]) {
            errors[field] = 'Field is required'
            invalidForm = true
          }

          return
        default:
          return
      }
    })
    if (invalidForm) {
      dispatch({ errors, type: 'set_error' })

      return false
    }
    dispatch({ errors, type: 'set_error' })

    return true
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const validated = validateForm()

    if (validated) {
      setIsLoading(true)
      const data = {
        title: stateForm.form.title,
        description: stateForm.form.description
      }
      const res = await dispatchAction(boardId ? updateBoard(data, boardId) : createBoard(data))

      if (res && (res.status === 200 || res.status === 201) && res.data) {
        dispatch({ form: initForm, type: 'set_form' })
        if (!boardId) {
          Notification.Success({
            msg: 'Board Created successfully'
          })
        } else {
          Notification.Success({
            msg: 'Board updated successfully'
          })
        }
        navigate('/board')
      } else {
        if (res?.data)
          Notification.Error({
            msg: `Something went wrong: ${res.data.detail || ''}`
          })
      }
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  const extremeSmallScreenBreakpoint = 640
  const isExtremeSmallScreen = width <= extremeSmallScreenBreakpoint ? true : false

  return (
    <Modal closeCB={() => setOpenBoard(false)} isOpen={openBoard}>
      <div className="w-full max-w-lg divide-y divide-gray-200">
        <div className="flex justify-between">
          <h2 className="my-2 pl-5 text-2xl">{headerText}</h2>
          <IconButton
            aria-label="Close"
            className="fill-current px-4 text-white md:hidden"
            onClick={() => navigate('/boards')}
          >
            <Close style={{ color: '#52525b' }} />
          </IconButton>
        </div>
        <form className="p-5" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-2">
            <TextFormField
              error={stateForm.errors.title}
              id="title"
              label={<span className="text-sm">Title</span>}
              name="title"
              placeholder="Title"
              value={stateForm.form.title}
              onChange={handleFormFieldChange}
            />
          </div>
          <div className="mb-2">
            <TextFormField
              error={stateForm.errors.description}
              id="description"
              label={<span className="text-sm">Description</span>}
              name="description"
              placeholder="Description"
              value={stateForm.form.description}
              onChange={handleFormFieldChange}
            />
          </div>
          <div
            className={`${
              isExtremeSmallScreen ? ' grid grid-cols-1 ' : ' flex justify-between '
            } mt-6 gap-2 `}
          >
            <Button variant="danger" onClick={() => navigate(`/board/${boardId}`)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={(e) => handleSubmit(e)}>
              {buttonText}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
