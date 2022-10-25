import React from 'react'
import loadable from '@loadable/component'
import { CircularProgress } from '@mui/material'
import { Link, navigate, useQueryParams } from 'raviger'
import { useDispatch } from 'react-redux'
import { Board } from 'types/task'

import { InputSearchBox } from '../Common/SearchBox'
import { statusType, useAbortableEffect } from '../../Common/utils'
import { getBoards } from '../../Redux/actions'
import Pagination from '../Common/Pagination'

const Loading = loadable(() => import('../Common/Loading'))
const PageTitle = loadable(() => import('../Common/PageTitle'))

type Data = {
  board: Board[]
  count: number
}

const initData: Data = {
  board: [],
  count: 0
}

export const Boards = () => {
  const dispatch: any = useDispatch()
  const [data, setData] = React.useState<Data>(initData)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)

  const [offset, setOffset] = React.useState(0)
  const [qParams, setQueryParams] = useQueryParams()
  const limit = 10

  const fetchTasks = React.useCallback(
    async (status: statusType) => {
      setIsLoading(true)
      const params = {
        title: qParams.title || '',
        limit,
        offset
      }

      const res = await dispatch(getBoards(params))

      if (!status.aborted) {
        if (res && res.data) {
          setData({
            board: res.data.results,
            count: res.data.count
          })
        }
        setIsLoading(false)
      }
    },
    [dispatch, qParams.title, offset]
  )

  useAbortableEffect(
    (status: statusType) => {
      fetchTasks(status)
    },
    [fetchTasks]
  )

  const updateQuery = (params: any) => {
    const nParams = Object.assign({}, qParams, params)

    setQueryParams(nParams, { replace: true })
  }

  const onSearchSuspects = (value: string) => {
    updateQuery({ title: value })
  }

  const removeFilter = (paramKey: any) => {
    updateQuery({
      ...qParams,
      [paramKey]: ''
    })
  }

  const badge = (key: string, value: any, paramKey: string) => {
    return (
      value && (
        <span className="inline-flex h-full items-center rounded-full border bg-white px-3 py-1 text-xs font-medium leading-4 text-gray-600">
          {key}
          {': '}
          {value}
          <i
            className="fas fa-times ml-2 cursor-pointer rounded-full px-1 py-0.5 hover:bg-gray-500"
            onClick={(_) => removeFilter(paramKey)}
          />
        </span>
      )
    )
  }

  const handlePagination = (page: number, limit: number) => {
    const offset = (page - 1) * limit

    setCurrentPage(page)
    setOffset(offset)
  }

  let boards: React.ReactNode[] = []

  if (data.board && data.board.length) {
    boards = data.board.map((b: Board, idx) => (
      <div key={idx}>
        <div className="block h-full rounded-lg bg-white shadow hover:border-teal-500">
          <div className="flex h-full">
            <div className="hidden w-1/4 shrink-0 items-center justify-center self-stretch bg-gray-300 md:flex">
              <i className="fab fa-flipboard block text-4xl text-gray-200" />
            </div>
            <div className="h-full w-full grow">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="w-full px-4 py-2 md:pl-2">
                  <div className="flow-root">
                    <div className="float-left text-xl font-bold capitalize">{b.title}</div>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <div className="flex flex-col">
                      <div className="font-semibold">{b?.description}</div>
                    </div>
                  </div>
                </div>
                <div className="flex-none border-t bg-gray-50 p-2 md:px-6">
                  <div className="flex justify-between py-4">
                    <div className="flex w-full flex-wrap justify-between gap-2">
                      <div />
                      <div className="flex gap-2 ">
                        <Link
                          className="inline-flex items-center rounded-md border border-teal-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-teal-700 transition duration-150 ease-in-out hover:text-teal-500 hover:shadow focus:border-teal-300 focus:outline-none focus:ring-blue-300 active:bg-gray-50 active:text-teal-800"
                          href={`/boards/${b.id}`}
                        >
                          <i className="fas fa-hospital mr-2 text-teal-500" />
                          Board
                        </Link>
                        <Link
                          className=" inline-flex items-center rounded-md border border-teal-500 bg-white px-3 py-2 text-sm font-medium leading-4 text-teal-700 transition duration-150 ease-in-out hover:text-teal-500 hover:shadow focus:border-teal-300 focus:outline-none focus:ring-blue-300 active:bg-gray-50 active:text-teal-800"
                          href={`/boards/${b.id}/tasks`}
                        >
                          <i className="fas fa-user-injured mr-2 text-teal-500" />
                          Tasks
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  const hasFiltersApplied = (qParams: any) => {
    return qParams.title
  }

  let manageBoard: React.ReactNode = null

  if (isLoading || !data) {
    manageBoard = <Loading />
  } else if (data.board && data.board.length) {
    manageBoard = (
      <>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">{boards}</div>
        {data.count > limit && (
          <div className="mt-4 flex w-full justify-center">
            <Pagination
              cPage={currentPage}
              data={{ totalCount: data.count }}
              defaultPerPage={limit}
              onChange={handlePagination}
            />
          </div>
        )}
      </>
    )
  } else if (data.board && data.board.length === 0) {
    manageBoard = hasFiltersApplied(qParams) ? (
      <div className="w-full rounded-lg p-3">
        <div className="mt-4 flex w-full  justify-center text-2xl font-bold text-gray-600">
          No Boards
        </div>
      </div>
    ) : (
      <div>
        <div
          className="mt-4 cursor-pointer whitespace-nowrap rounded-md border border-gray-500 bg-white p-16 text-center text-sm font-semibold shadow hover:bg-gray-300"
          onClick={() => navigate('/boards/create')}
        >
          <i className="fas fa-plus text-3xl" />
          <div className="mt-2 text-xl">Create Board</div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2 pb-2">
      <PageTitle breadcrumbs={false} hideBack={true} title="Boards" />
      <div className="mt-4 gap-2 lg:flex">
        <div className="min-w-fit flex-1 overflow-hidden rounded-lg bg-white shadow md:mr-2">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="truncate text-sm font-medium leading-5 text-gray-500">Total Boards</dt>
              {/* Show spinner until cound is fetched from server */}
              {isLoading ? (
                <dd className="mt-4 text-5xl leading-9">
                  <CircularProgress className="text-teal-500" />
                </dd>
              ) : (
                <dd className="mt-4 text-5xl font-semibold leading-9 text-gray-900">
                  {data.count}
                </dd>
              )}
            </dl>
          </div>
        </div>
        <div className="my-4 flex grow flex-col justify-between gap-2 md:flex-row">
          <div className="w-full md:w-72">
            <InputSearchBox
              errors=""
              placeholder="Search Board"
              search={onSearchSuspects}
              value={qParams.title}
            />
          </div>
        </div>
      </div>
      <div className="col-span-3 my-2 flex w-full flex-wrap items-center gap-2">
        {badge('Board Name', qParams.title, 'title')}
      </div>
      <div className="mt-4 pb-4">
        <div>{manageBoard}</div>
      </div>
    </div>
  )
}
