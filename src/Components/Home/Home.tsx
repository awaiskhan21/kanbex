import loadable from '@loadable/component'
// import { useQueryParams } from 'raviger'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getUserTeam } from '../../Redux/actions'

const Loading = loadable(() => import('../Common/Loading'))
const PageTitle = loadable(() => import('../Common/PageTitle'))

// type ParamsTypes = Record<string, number | boolean | string>

export const Home = () => {
  const dispatch: any = useDispatch()
  const state: any = useSelector((state) => state)
  const { currentUser } = state
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // const [qParams, setQueryParams] = useQueryParams()

  const params = {
    created_by: currentUser.data.username,
    // team: qParams.team || undefined,
    team: undefined
  }

  useEffect(() => {
    setIsLoading(true)
    dispatch(getUserTeam(params))
      .then((res: any) => {
        if (res && res.data) {
          setData(res.data.results)
        }
        setIsLoading(false)

        return
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [dispatch, currentUser])

  //   const updateQuery = (params: ParamsTypes) => {
  //     const nParams = Object.assign({}, qParams, params)
  //     setQueryParams(nParams, { replace: true })
  //   }
  //   const searchByName = (value: string) => {
  //     updateQuery({ name: value, page: 1 })
  //   }

  return (
    <div className="px-2 pb-2">
      <PageTitle breadcrumbs={false} hideBack={true} title="Home" />
      <img alt="jugaad-banner" className="h-1/4 w-full py-4" src="/images/jugaad-banner.png" />
      <PageTitle breadcrumbs={false} hideBack={true} title="Money" />
      <div className="">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data.map((dt, index) => (
              <div key={index} className="mt-5 grid grid-cols-12 gap-6">
                <div className="col-span-12 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 sm:col-span-6 xl:col-span-3">
                  <div className="p-5">
                    <div className="">Profit</div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{dt.total}</div>
                        <div className="mt-1 text-base text-gray-600">Rupees</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 sm:col-span-6 xl:col-span-3">
                  <div className="p-5">
                    <div className="">Money Earned</div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{dt.earned}</div>
                        <div className="mt-1 text-base text-gray-600">Rupees</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 sm:col-span-6 xl:col-span-3">
                  <div className="p-5">
                    <div className="">Money Invested</div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{dt.invested}</div>
                        <div className="mt-1 text-base text-gray-600">Rupees</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 rounded-lg bg-white shadow-xl transition duration-300 hover:scale-105 sm:col-span-6 xl:col-span-3">
                  <div className="p-5">
                    <div className="">StuCred Registration</div>
                    <div className="ml-2 w-full flex-1">
                      <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{dt.stucred_regis}</div>
                        <div className="mt-1 text-base text-gray-600">Count</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
