import type { statusType } from '../Common/utils'

import loadable from '@loadable/component'
import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useAbortableEffect } from '../Common/utils'
import { getCurrentUser } from '../Redux/actions'
import AppRouter from '../Router/AppRouter'
import SessionRouter from '../Router/SessionRouter'

const Loading = loadable(() => import('./Common/Loading'))

const App = () => {
  const dispatch: any = useDispatch()
  const state: any = useSelector((state) => state)
  const { currentUser } = state
  const [user, setUser] = React.useState(null)

  const updateRefreshToken = () => {
    const refresh = localStorage.getItem('kanbex_refresh_token')
    const access = localStorage.getItem('kanbex_access_token')

    if (!access && refresh) {
      localStorage.removeItem('kanbex_refresh_token')
      document.location.reload()

      return
    }
    if (!refresh) {
      return
    }
    axios
      .post('/api/v1/auth/token/refresh/', {
        refresh
      })
      // eslint-disable-next-line promise/always-return
      .then((resp) => {
        localStorage.setItem('kanbex_access_token', resp.data.access)
        localStorage.setItem('kanbex_refresh_token', resp.data.refresh)
        localStorage.setItem('preferenceSidebar', 'collapsed')
      })
      .catch((_) => {
        // console.error('Error while refreshing',ex);
      })
  }

  React.useEffect(() => {
    updateRefreshToken()
    setInterval(updateRefreshToken, 5 * 60 * 1000)
  }, [user])

  useAbortableEffect(
    async (status: statusType) => {
      const res = await dispatch(getCurrentUser())

      if (!status.aborted && res && res.statusCode === 200) {
        setUser(res.data)
      }
    },
    [dispatch]
  )

  if (!currentUser || currentUser.isFetching) {
    return <Loading />
  }
  if (currentUser && currentUser.data) {
    return <AppRouter />
  } else {
    return <SessionRouter />
  }
}

export default App
