import React from 'react'
import { useDispatch } from 'react-redux'

import { statusType, useAbortableEffect } from '../../Common/utils'
import { getTasks } from '../../Redux/actions'
import { Stage, Task } from '../../types/task'

type ViewStageProps = {
  boardId: string
  stage: Stage
}
const limit = 10

const TaskCard = ({ task }: any) => {
  const dispatch: any = useDispatch()
  const [modalFor, setModalFor] = React.useState({
    externalId: undefined,
    loading: false
  })
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: "shift-card",
  //   item: shift,
  //   collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  // }));

  // const handleTransferComplete = (shift: any) => {
  //   setModalFor({ ...modalFor, loading: true });
  //   dispatch(completeTransfer({ externalId: modalFor })).then(() => {
  //     navigate(
  //       `/facility/${shift.assigned_facility}/patient/${shift.patient}/consultation`
  //     );
  //   });
  // };
  return (
    <div
      // ref={drag}
      className="mt-2 w-full"
    >
      <div
        className="mx-2 h-full overflow-hidden rounded-lg bg-white shadow"
        // style={{
        //   opacity: isDragging ? 0.2 : 1,
        //   cursor: isDragging ? 'grabbing' : 'grab'
        // }}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div>
            <div className="flex justify-between">
              <div className="mb-2 text-xl font-bold capitalize">{task.title} </div>
              <div>
                {/* {shift.emergency && (
                  <span className="inline-block shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium leading-4 text-red-800">
                    Emergency
                  </span>
                )} */}
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-1 gap-y-2 sm:grid-cols-1">
              <div className="sm:col-span-1">
                <dt
                  className="flex items-center text-sm font-medium leading-5 text-gray-500"
                  title="Phone Number"
                >
                  <i className="fas fa-mobile mr-2" />
                  <dd className="break-normal text-sm font-bold leading-5 text-gray-900">
                    {task.description || ''}
                  </dd>
                </dt>
              </div>
              <div className="sm:col-span-1">
                <dt
                  className="flex items-center text-sm font-medium leading-5 text-gray-500"
                  title=" Origin facility"
                >
                  <i className="fas fa-plane-departure mr-2" />
                  <dd className="break-normal text-sm font-bold leading-5 text-gray-900">
                    {task.due_date}
                  </dd>
                </dt>
              </div>
              <div className="sm:col-span-1">
                <dt
                  className="flex items-center text-sm font-medium leading-5 text-gray-500"
                  title="Shifting approving facility"
                >
                  <i className="fas fa-user-check mr-2" />
                  <dd className="break-normal text-sm font-bold leading-5 text-gray-900">
                    {task.priority}
                  </dd>
                </dt>
              </div>
              {/* <div className="sm:col-span-1">
                <dt
                  className={`flex items-center text-sm font-medium leading-5 ${
                    moment().subtract(2, 'hours').isBefore(shift.modified_date)
                      ? 'text-gray-900'
                      : 'rounded bg-red-400 p-1 text-white'
                  }`}
                  title="  Last Modified"
                >
                  <i className="fas fa-stopwatch mr-2" />
                  <dd className="break-normal text-sm font-bold leading-5">
                    {formatDate(shift.modified_date) || '--'}
                  </dd>
                </dt>
              </div> */}

              {/* <div className="sm:col-span-1">
                <dt
                  className="flex items-center text-sm font-medium leading-5 text-gray-500"
                  title="Patient Address"
                >
                  <i className="fas fa-home mr-2" />
                  <dd className="break-normal text-sm font-bold leading-5 text-gray-900">
                    {shift.patient_object.address || '--'}
                  </dd>
                </dt>
              </div>

              {shift.assigned_to_object && (
                <div className="sm:col-span-1">
                  <dt
                    className="flex items-center text-sm font-medium leading-5 text-gray-500"
                    title="Assigned to"
                  >
                    <i className="fas fa-user mr-2" />
                    <dd className="break-normal text-sm font-bold leading-5 text-gray-900">
                      {shift.assigned_to_object.first_name} {shift.assigned_to_object.last_name} -{' '}
                      {shift.assigned_to_object.user_type}
                    </dd>
                  </dt>
                </div>
              )} */}

              {/* <div className="sm:col-span-1">
                <dt
                  className="flex items-center text-sm font-medium leading-5 text-gray-500"
                  title="Patient State"
                >
                  <i className="fas fa-thumbtack mr-2" />
                  <dd className="text-sm font-bold leading-5 text-gray-900">
                    {shift.patient_object.state_object.name || '--'}
                  </dd>
                </dt>
              </div> */}
            </dl>
          </div>

          {/* <div className="mt-2 flex">
            <button
              className="btn btn-default mr-2 w-full bg-white"
              onClick={(_) => navigate(`/board/${task.external_id}`)}
            >
              <i className="fas fa-eye mr-2" /> All Details
            </button>
          </div> */}
        </div>
      </div>
    </div>
  )
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

  const [offset, setOffset] = React.useState(10)

  const fetchTask = React.useCallback(
    async (status: statusType) => {
      setIsLoading(true)
      const params = {
        offset,
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
    [boardId, dispatch, offset, stage.id]
  )

  useAbortableEffect(
    (status: statusType) => {
      fetchTask(status)
    },
    [fetchTask]
  )

  const handlePagination = (limit: number, page: number) => {
    setOffset((page - 1) * limit)
    setPage(page)
  }

  return (
    <div className="mr-2 h-full w-full shrink-0 overflow-y-auto rounded-md bg-gray-200 pb-4 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <div className="sticky top-0 z-10 rounded bg-gray-200 pt-2">
        <div className="mx-2 flex items-center justify-between rounded bg-white p-4 shadow">
          <h3 className="flex h-8 items-center text-xs">{stage.board_object?.title}</h3>
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
          taskData.task.map((task, idx) => <TaskCard key={idx} task={task} />)
        ) : (
          <p className="mx-auto p-4">No tasks to show.</p>
        )}
        {!isLoading && taskData.task?.length < (taskData.count || 0) ? (
          <div className="mx-auto my-4 rounded-md bg-gray-100 p-2 px-4 hover:bg-white">Loading</div>
        ) : (
          <button
            className="mx-auto my-4 rounded-md bg-gray-100 p-2 px-4 hover:bg-white"
            onClick={(_) => handlePagination(page + 1, limit)}
          >
            More...
          </button>
        )}
      </div>
    </div>
  )
}
