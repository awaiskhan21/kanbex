import React from 'react'
import { useDispatch } from 'react-redux'
import loadable from '@loadable/component'
import { Link, navigate } from 'raviger'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import TaskIcon from '@mui/icons-material/Task'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import moment from 'moment'
// import withScrolling from 'react-dnd-scrolling'

import * as Notification from '../../Utils/Notification.js'
import { Board, Stage } from '../../types/task'
import { statusType, useAbortableEffect } from '../../Common/utils'
import { getBoard, getStages, deleteBoard } from '../../Redux/actions'
import { ViewStage } from '../Stage/ViewStage'
import Button from '../Common/Button'

// const ScrollingComponent = withScrolling('div')

const Loading = loadable(() => import('../Common/Loading'))
const PageTitle = loadable(() => import('../Common/PageTitle'))

type ViewBoardProps = {
  boardId: string
}

export const ViewBoard = (props: ViewBoardProps) => {
  const { boardId } = props
  const dispatch: any = useDispatch()

  const [boardData, setBoardData] = React.useState<Board>({})
  const [stageData, setStageData] = React.useState<Stage[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

  const fetchBoard = React.useCallback(
    async (status: statusType) => {
      setIsLoading(true)
      const boardRes = await dispatch(getBoard(boardId))

      if (boardRes) {
        const [stageRes] = await Promise.all([dispatch(getStages({ board: boardId }))])

        if (!status.aborted) {
          setIsLoading(false)
          if (!boardRes.data) {
            Notification.Error({
              msg: 'Something went wrong..!'
            })
          } else {
            setBoardData(boardRes.data)
            if (stageRes && stageRes.data) {
              setStageData(stageRes.data.results)
            }
          }
        }
      } else {
        // navigate('/not-found')
        setIsLoading(false)
      }
    },
    [boardId, dispatch]
  )

  useAbortableEffect(
    (status: statusType) => {
      fetchBoard(status)
    },
    [fetchBoard]
  )
  const handleDeleteClose = () => {
    setOpenDeleteDialog(false)
  }

  const handleDeleteSubmit = async () => {
    const res = await dispatch(deleteBoard(boardId))

    if (res?.status === 204) {
      Notification.Success({
        msg: 'Board deleted successfully'
      })
    } else {
      Notification.Error({
        msg: `Error while deleting Board: ${res?.data?.detail || ''}`
      })
    }
    navigate('/board')
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex h-screen flex-col px-2 pb-2">
      <div className="flex w-full flex-col items-center justify-between md:flex-row">
        <div className="w-1/3 lg:w-1/4">
          <PageTitle
            className="mx-3 md:mx-5"
            crumbsReplacements={{ [boardId]: { name: boardData.title } }}
            title={boardData.title || 'Board'}
          />
        </div>
      </div>
      <Dialog maxWidth={'md'} open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle className="flex justify-center bg-red-100">
          Are you sure you want to delete {boardData.title || 'Facility'}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will not be able to view this board after it is deleted.
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
      <div className="rounded-lg bg-white p-3 shadow md:p-6">
        <div className="justify-between gap-2 lg:flex">
          <div className="flex-col justify-between md:flex">
            <div className="flex flex-1 flex-col gap-3">
              <div>
                <div className="flex flex-row gap-2">
                  <h1 className="text-4xl font-bold">{boardData.title}</h1>
                  <Link href={`/board/${boardData.id}/update`}>
                    <EditIcon style={{ color: '#10b981' }} />
                  </Link>
                  <Link href={`/board/${boardData.id}/delete`}>
                    <DeleteForeverIcon style={{ color: '#dc2626' }} />
                  </Link>
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  Last updated{' '}
                  {boardData?.modified_date && moment(boardData?.modified_date).fromNow()}
                </p>
              </div>
              <div className="flex flex-1 items-center">
                <div className="mb-6 grid  w-full grid-cols-1 gap-4 md:mb-0 lg:grid-cols-2">
                  <div className="flex-col justify-between md:flex lg:flex-1 ">
                    <div className="mb-4">
                      <h1 className="text-lg font-bold">Description</h1>
                      <p className="text-lg">{boardData.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 md:mt-4">
            <div className="flex w-full flex-row gap-2 lg:flex-col">
              <Button
                className="w-full"
                variant="primary"
                onClick={() => navigate(`/board/${boardData.id}/stage/add`)}
              >
                <AddCircleIcon style={{ marginRight: '6px' }} />
                Create Stage
              </Button>
              <Button
                className="w-full"
                variant="primary"
                onClick={() => navigate(`/tasks?board=${boardData.id}`)}
              >
                <TaskIcon style={{ marginRight: '6px' }} />
                View Tasks
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-start overflow-x-scroll px-4 pb-2">
        <div className="mt-4 flex flex-1 items-start overflow-x-scroll px-2 pb-2">
          {isLoading ? (
            <Loading />
          ) : (
            stageData.map((stage, idx) => <ViewStage key={idx} boardId={boardId} stage={stage} />)
          )}
        </div>
      </div>
    </div>
  )
}
