import { Link, navigate } from 'raviger'
import React from 'react'
import { useDispatch } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import * as Notification from '../../Utils/Notification.js'
import { ViewTask } from '../Task'
import { statusType, useAbortableEffect } from '../../Common/utils'
import { getTasks, deleteStage } from '../../Redux/actions'
import { Stage, Task } from '../../types/task'
import Button from '../Common/Button'

type ViewStageProps = {
  boardId: string
  stage: Stage
}

export const ViewStage = (props: ViewStageProps) => {
  const { boardId, stage } = props
  const dispatch: any = useDispatch()
  const [isLoading, setIsLoading] = React.useState(false)
  const [taskData, setTaskData] = React.useState<{
    task: Task[]
    count: number
  }>({
    task: [],
    count: 0
  })
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

  const fetchTask = React.useCallback(
    async (status: statusType) => {
      setIsLoading(true)
      const params = {
        limit,
        board: boardId,
        stage: stage.id
      }
      const res = await dispatch(getTasks(params))

      if (!status.aborted) {
        if (res && res.data) {
          setTaskData({
            task: res.data.results,
            count: res.data.count
          })
        }
        setIsLoading(false)
      }
    },
    [boardId, dispatch, limit, stage.id]
  )

  useAbortableEffect(
    (status: statusType) => {
      fetchTask(status)
    },
    [fetchTask]
  )

  const handlePagination = (limit: number, page: number) => {
    setLimit(limit + (page - 1) * limit)
    setPage(page)
  }

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false)
  }

  const handleDeleteSubmit = async () => {
    if (stage.id) {
      const res = await dispatch(deleteStage(stage.id))

      if (res?.status === 204) {
        Notification.Success({
          msg: 'Stage deleted successfully'
        })
      } else {
        Notification.Error({
          msg: `Error while deleting Stage: ${res?.data?.detail || ''}`
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
          Are you sure you want to delete {stage.title || 'Stage'}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will not be able to view this stage after it is deleted.
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
      <div className="mr-2 h-full w-full shrink-0 overflow-y-auto rounded-md bg-gray-200 pb-4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="sticky top-0 z-10 rounded bg-gray-200 pt-2">
          <div className="mx-2 flex items-center justify-between rounded bg-white p-4 shadow">
            <div className="flex flex-row gap-2">
              <h1 className="flex h-8 items-center font-bold">{stage.title}</h1>
              <Link href={`/board/${boardId}/stage/${stage.id}/update`}>
                <EditIcon style={{ color: '#10b981', marginTop: '8px' }} />
              </Link>
              <button onClick={() => setOpenDeleteDialog(true)}>
                <DeleteForeverIcon style={{ color: '#dc2626' }} />
              </button>
            </div>
            <span className="ml-2 rounded-lg bg-zinc-500 px-2 text-white">
              {taskData.count || '0'}
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-col pb-2 text-sm">
          {isLoading ? (
            <div className="m-1">
              <div className="mx-auto w-full max-w-sm rounded-md border border-gray-300 bg-white p-4 shadow">
                <div className="flex animate-pulse space-x-4 ">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 w-3/4 rounded bg-gray-400" />
                    <div className="space-y-2">
                      <div className="h-4 rounded bg-gray-400" />
                      <div className="h-4 w-5/6 rounded bg-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : taskData.task?.length > 0 ? (
            taskData.task.map((task, idx) => <ViewTask key={idx} task={task} />)
          ) : (
            <p className="mx-auto p-4">No tasks to show.</p>
          )}
          {taskData.task?.length < (taskData.count || 0) &&
            (isLoading ? (
              <div className="mx-auto my-4 rounded-md bg-gray-100 p-2 px-4 hover:bg-white">
                Loading
              </div>
            ) : (
              <button
                className="mx-auto my-4 rounded-md bg-gray-100 p-2 px-4 hover:bg-white"
                onClick={(_) => handlePagination(10, page + 1)}
              >
                More...
              </button>
            ))}
        </div>
        <div className="my-auto w-full rounded-lg py-2">
          <div className="flex w-full  justify-center text-2xl font-bold text-gray-600">
            <Link href={`/board/${boardId}/stage/${stage.id}/task/add`}>
              <AddIcon style={{ color: '#10b981' }} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
