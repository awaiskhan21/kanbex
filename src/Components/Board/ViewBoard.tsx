import React from 'react'
import { useDispatch } from 'react-redux'
import loadable from '@loadable/component'
import { navigate } from 'raviger'
// import withScrolling from 'react-dnd-scrolling'

import * as Notification from '../../Utils/Notification.js'
import { Board, Stage } from '../../types/task'
import { statusType, useAbortableEffect } from '../../Common/utils'
import { getBoard, getStages, deleteBoard } from '../../Redux/actions'
import { ViewStage } from '../Stage/ViewStage'

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
          <PageTitle breadcrumbs={false} className="mx-3 md:mx-5" hideBack={true} title={'Board'} />
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
