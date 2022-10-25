import type { statusType } from '../../Common/utils'

import loadable from '@loadable/component'
import { IconButton, InputLabel } from '@mui/material'
import { navigate } from 'raviger'
import { useCallback, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Close } from '@mui/icons-material'

import useWindowDimensions from '../../Common/hooks/useWindowDimensions'
import { useAbortableEffect } from '../../Common/utils'
import { createStage, updateStage, getStage } from '../../Redux/actions'
import * as Notification from '../../Utils/Notification.js'
import { goBack } from '../../Utils/utils'
import TextInputField from '../Common/TextInputField'
import Modal from '../Common/Modal'
import { Stage } from '../../types/task'
import Button from '../Common/Button'

const Loading = loadable(() => import('../Common/Loading'))

const initForm: Stage = {
  title: '',
  description: ''
}

const initError: Record<keyof Stage, string> = Object.assign(
  {},
  ...Object.keys(initForm).map((k) => ({ [k]: '' }))
)

const initialState = {
  errors: { ...initError },
  form: { ...initForm }
}

type SetFormAction = { type: 'set_form'; form: Stage }
type SetErrorAction = {
  type: 'set_error'
  errors: Record<keyof Stage, string>
}
type StageCreateFormAction = SetFormAction | SetErrorAction

const activity_reducer = (state = initialState, action: StageCreateFormAction) => {
  switch (action.type) {
    case 'set_form':
      return { ...state, form: action.form }
    case 'set_error':
      return { ...state, errors: action.errors }
  }
}

type CreateStageProps = {
  boardId: string
  stageId?: string
}

export const CreateStage = (props: CreateStageProps) => {
  const dispatchAction: any = useDispatch()
  const { stageId, boardId } = props
  const [stateForm, dispatch] = useReducer(activity_reducer, initialState)
  const [openStage, setOpenStage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { width } = useWindowDimensions()

  const headerText = !stageId ? 'Create Stage' : 'Update Stage'
  const buttonText = !stageId ? 'Save Stage' : 'Update Stage'

  const fetchData = useCallback(
    async (status: statusType) => {
      if (stageId) {
        setIsLoading(true)
        const res = await dispatchAction(getStage(stageId))

        if (!status.aborted && res.data) {
          const formData = {
            title: res.data.title,
            description: res.data.description
          }

          dispatch({ form: formData, type: 'set_form' })
        } else {
          navigate(`/board/${boardId}`)
        }
        setIsLoading(false)
      }
    },
    [stageId, dispatchAction, boardId]
  )

  useAbortableEffect(
    (status: statusType) => {
      if (stageId) {
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
        description: stateForm.form.description,
        board: boardId
      }
      const res = await dispatchAction(stageId ? updateStage(data, stageId) : createStage(data))

      if (res && (res.status === 200 || res.status === 201) && res.data) {
        dispatch({ form: initForm, type: 'set_form' })
        if (!stageId) {
          Notification.Success({
            msg: 'Stage Created successfully'
          })
        } else {
          Notification.Success({
            msg: 'Stage updated successfully'
          })
        }
        navigate(`/board/${boardId}`)
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
    <Modal closeCB={() => setOpenStage(false)} isOpen={openStage}>
      <div className="w-full max-w-lg divide-y divide-gray-200">
        <div className="flex justify-between">
          <h2 className="my-2 pl-5 text-2xl">{headerText}</h2>
          <IconButton
            aria-label="Close"
            className="fill-current px-4 text-white md:hidden"
            onClick={() => navigate(`/board/${boardId}`)}
          >
            <Close style={{ color: '#fff' }} />
          </IconButton>
        </div>
        <form className="p-5" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <InputLabel id="title-label">Title*</InputLabel>
            <TextInputField
              error={stateForm.errors.title}
              id="title"
              name="title"
              placeholder=""
              value={stateForm.form.title}
              onChange={(e) => handleValueChange(e.target.value, 'title')}
            />
          </div>
          <div className="mb-4">
            <InputLabel id="details-label">Description*</InputLabel>
            <TextInputField
              error={stateForm.errors.description}
              id="description"
              name="description"
              placeholder=""
              value={stateForm.form.description}
              onChange={(e) => handleValueChange(e.target.value, 'description')}
            />
          </div>
          <div
            className={`${
              isExtremeSmallScreen ? ' grid grid-cols-1 ' : ' flex justify-between '
            } mt-6 gap-2 `}
          >
            <Button variant="danger" onClick={() => goBack()}>
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
