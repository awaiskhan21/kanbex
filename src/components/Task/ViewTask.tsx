import React from 'react'
import { Link, navigate } from 'raviger'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DescriptionIcon from '@mui/icons-material/Description'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'

import * as Notification from '../../Utils/Notification.js'
import { Task } from '../../types/task'
import { deleteTask } from '../../Redux/actions'
import Button from '../Common/Button'

type ViewTaskProps = {
  task: Task
}

const priorityColor = [
  { text: 'Urgent', color: 'bg-black' },
  { text: 'High', color: 'bg-rose-700' },
  { text: 'Medium', color: 'bg-red-700' },
  { text: 'Low', color: 'bg-sky-700' }
]

export const ViewTask = (props: ViewTaskProps) => {
  const { task } = props
  const dispatch: any = useDispatch()

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

  const priorityBadge = (number: number) => {
    return (
      <div
        className={clsx(
          'rounded-lg border border-zinc-600 bg-zinc-100 px-3 py-1 text-sm font-semibold text-white',
          number > 3 ? 'bg-gray-900' : priorityColor[number].color
        )}
      >
        {priorityColor[number].text || 'Undefined'}
      </div>
    )
  }

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false)
  }

  const handleDeleteSubmit = async () => {
    if (task.id) {
      const res = await dispatch(deleteTask(task.id))

      if (res?.status === 204) {
        Notification.Success({
          msg: 'Task deleted successfully'
        })
      } else {
        Notification.Error({
          msg: `Error while deleting Task: ${res?.data?.detail || ''}`
        })
      }
    }
    setOpenDeleteDialog(false)
    window.location.reload()
  }

  return (
    <>
      <Dialog maxWidth={'md'} open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle className="flex justify-center bg-red-100">
          Are you sure you want to delete {task.title || 'Task'}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will not be able to view this task after it is deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
            <Button variant="danger" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <div className="mt-2 w-full">
        <div className="mx-2 h-full overflow-hidden rounded-lg bg-white shadow">
          <div className="flex h-full flex-col justify-between p-4">
            <div>
              <div className="flex justify-between">
                <div className="flex flex-row gap-2">
                  <h2 className="flex h-8 items-center text-sm">
                    {task.completed ? (
                      <s>{task.title}</s>
                    ) : (
                      <div className="font-bold">{task.title}</div>
                    )}
                  </h2>
                  <Link href={`/board/${task.board}/stage/${task.stage}/task/${task.id}/update`}>
                    <EditIcon style={{ color: '#10b981' }} />
                  </Link>
                  <button onClick={() => setOpenDeleteDialog(true)}>
                    <DeleteForeverIcon style={{ color: '#dc2626' }} />
                  </button>
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-1 gap-y-2 sm:grid-cols-1">
              <div className="sm:col-span-1">
                <div className="flex items-center whitespace-nowrap text-sm leading-5  text-gray-500">
                  <DescriptionIcon style={{ color: '#71717a', marginRight: '6px' }} />
                  <span className="break-normal text-sm leading-5 text-gray-900">
                    {task.description || ''}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-1">
                <div className="flex items-center text-sm leading-5 text-gray-500">
                  <CalendarMonthIcon style={{ color: '#71717a', marginRight: '6px' }} />
                  <span className="break-normal text-sm leading-5 text-gray-900">
                    {task.due_date}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-1">
                <div className="flex justify-end text-sm leading-5 text-gray-500">
                  <span className="break-normal text-sm leading-5 text-gray-900">
                    {priorityBadge(task.priority || 1)}
                  </span>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
