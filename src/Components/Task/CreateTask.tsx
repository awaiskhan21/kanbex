import type { statusType } from '../../Common/utils'

import loadable from '@loadable/component'
import { IconButton, InputLabel } from '@mui/material'
import { navigate } from 'raviger'
import { useCallback, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Close } from '@mui/icons-material'
import moment from 'moment'

import useWindowDimensions from '../../Common/hooks/useWindowDimensions'
import { useAbortableEffect } from '../../Common/utils'
import { createTask, updateTask, getTask } from '../../Redux/actions'
import * as Notification from '../../Utils/Notification.js'
import { goBack } from '../../Utils/utils'
import TextInputField from '../Common/TextInputField'
import Modal from '../Common/Modal'
import { Task } from '../../types/task'
import Button from '../Common/Button'
import DateFormField from '../Common/Form/FormFields/DateFormField'
import { FieldChangeEvent } from '../Common/Form/FormFields/Utils'
import SelectMenu from '../Common/Form/FormFields/SelectMenu'
import Switch from '../Common/Switch'

const Loading = loadable(() => import('../Common/Loading'))

const initForm: Task = {
  title: '',
  description: '',
  priority: 0,
  due_date: '',
  completed: false
}

const initError: Record<keyof Task, string> = Object.assign(
  {},
  ...Object.keys(initForm).map((k) => ({ [k]: '' }))
)

const initialState = {
  errors: { ...initError },
  form: { ...initForm }
}

type SetFormAction = { type: 'set_form'; form: Task }
type SetErrorAction = {
  type: 'set_error'
  errors: Record<keyof Task, string>
}
type TaskCreateFormAction = SetFormAction | SetErrorAction

const activity_reducer = (state = initialState, action: TaskCreateFormAction) => {
  switch (action.type) {
    case 'set_form':
      return { ...state, form: action.form }
    case 'set_error':
      return { ...state, errors: action.errors }
  }
}

type CreateTaskProps = {
  boardId: string
  stageId: string
  taskId?: string
}

export const CreateTask = (props: CreateTaskProps) => {
  const dispatchAction: any = useDispatch()
  const { taskId, stageId, boardId } = props
  const [stateForm, dispatch] = useReducer(activity_reducer, initialState)
  const [openTask, setOpenTask] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { width } = useWindowDimensions()

  const headerText = !taskId ? 'Create Task' : 'Update Task'
  const buttonText = !taskId ? 'Save Task' : 'Update Task'

  const fetchData = useCallback(
    async (status: statusType) => {
      if (taskId) {
        setIsLoading(true)
        const res = await dispatchAction(getTask(taskId))

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
    [taskId, dispatchAction, boardId]
  )

  useAbortableEffect(
    (status: statusType) => {
      if (taskId) {
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

  const handleDateRangeChange = (event: FieldChangeEvent<Date>) => {
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
        case 'priority':
        case 'due_date':
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
        priority: stateForm.form.priority,
        due_date: stateForm.form.due_date,
        completed: stateForm.form.completed,
        board: boardId,
        stage: stageId
      }
      const res = await dispatchAction(taskId ? updateTask(data, taskId) : createTask(data))

      if (res && (res.status === 200 || res.status === 201) && res.data) {
        dispatch({ form: initForm, type: 'set_form' })
        if (!taskId) {
          Notification.Success({
            msg: 'Task Created successfully'
          })
        } else {
          Notification.Success({
            msg: 'Task updated successfully'
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
    <Modal closeCB={() => setOpenTask(false)} isOpen={openTask}>
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
          <div className="mb-4">
            <InputLabel id="due_date-label">Due Date*</InputLabel>
            <DateFormField
              error={stateForm.errors.due_date}
              label="due_date"
              name="due_date"
              placeholder="Due Date"
              value={
                moment(stateForm.form.due_date, 'YYYY-MM-DD').toDate() ||
                moment().format('YYYY-MM-DD')
              }
              onChange={handleDateRangeChange}
            />
          </div>
          <div className="mb-4">
            <InputLabel id="details-label">Priority*</InputLabel>
            <SelectMenu
              optionLabel={(o) => o.text}
              optionValue={(o) => o.id}
              options={[
                {
                  id: 1,
                  text: 'Urgent'
                },
                {
                  id: 2,
                  text: 'High'
                },
                {
                  id: 3,
                  text: 'Medium'
                },
                {
                  id: 4,
                  text: 'Low'
                }
              ]}
              value={stateForm.form.priority}
              onChange={(e) => handleValueChange(e, 'priority')}
            />
          </div>
          <div className="mb-4">
            <InputLabel id="completed-label">Completed*</InputLabel>
            <Switch
              required
              className="col-span-6"
              error={stateForm.errors.completed}
              label="completed"
              name="completed"
              optionLabel={(o) => (o ? 'True' : 'False')}
              options={[true, false]}
              value={stateForm.form.completed}
              onChange={(e) => handleValueChange(e, 'completed')}
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
