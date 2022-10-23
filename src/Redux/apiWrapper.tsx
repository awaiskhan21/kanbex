import axios from 'axios'

import * as Notification from '../Utils/Notification.js'

import api from './api'

const requestMap: any = api

export const actions = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_REQUEST_ERROR: 'FETCH_REQUEST_ERROR',
  FETCH_REQUEST_SUCCESS: 'FETCH_REQUEST_SUCCESS',
  SET_DATA: 'SET_DATA'
}

const isRunning: any = {}

export const setStoreData = (key: string, value: any) => {
  return {
    key,
    type: actions.SET_DATA,
    value
  }
}

export const fetchDataRequest = (key: string) => {
  return {
    key,
    type: actions.FETCH_REQUEST
  }
}

export const fetchDataRequestError = (key: string, error: any) => {
  return {
    error,
    key,
    type: actions.FETCH_REQUEST_ERROR
  }
}

export const fetchResponseSuccess = (key: string, data: any) => {
  return {
    data,
    key,
    type: actions.FETCH_REQUEST_SUCCESS
  }
}

export const fireRequest = (
  key: string,
  path: any = [],
  params: any = {},
  pathParam?: any,
  altKey?: string,
  suppressNotif?: boolean
) => {
  return (dispatch: any) => {
    // cancel previous api call
    if (isRunning[altKey ? altKey : key]) {
      isRunning[altKey ? altKey : key].cancel()
    }
    isRunning[altKey ? altKey : key] = axios.CancelToken.source()
    // get api url / method
    const request = Object.assign({}, requestMap[key])

    if (path.length > 0) {
      request.path += `/${path.join('/')}`
    }
    // add trailing slash to path before query paramaters
    if (request.path.slice(-1) !== '/' && request.path.indexOf('?') === -1) {
      request.path += '/'
    }
    if (request.method === undefined || request.method === 'GET') {
      request.method = 'GET'
      const qs = new URLSearchParams(params).toString()

      if (qs !== '') {
        request.path += `?${qs}`
      }
    }
    // set dynamic params in the URL
    if (pathParam) {
      Object.keys(pathParam).forEach((param: any) => {
        request.path = request.path.replace(`{${param}}`, pathParam[param])
      })
    }

    // set authorization header in the request header
    const config: any = {
      headers: {}
    }

    if (!request.noAuth && localStorage.getItem('kanbex_access_token')) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('kanbex_access_token')}`
    }
    const axiosApiCall: any = axios.create(config)

    dispatch(fetchDataRequest(key))

    return axiosApiCall[request.method.toLowerCase()](request.path, {
      ...params,
      cancelToken: isRunning[altKey ? altKey : key].token
    })
      .then((response: any) => {
        dispatch(fetchResponseSuccess(key, response.data))

        return response
      })
      .catch((error: any) => {
        if (error.code === 'ERR_CANCELED') {
          return
        }
        dispatch(fetchDataRequestError(key, error.name))
        if (!(suppressNotif ?? false) && error.response) {
          // deleteUser: 404 is for permission denied
          if (error.response.status === 404 && key === 'deleteUser') {
            Notification.Error({
              msg: 'Permission denied!'
            })

            return
          }

          // currentUser is ignored because on the first page load
          // 403 error is displayed for invalid credential.
          if (error.response.status === 403 && key === 'currentUser') {
            if (localStorage.getItem('kanbex_access_token')) {
              localStorage.removeItem('kanbex_access_token')
            }

            return
          }

          // 400 Bad Request Error
          if (error.response.status === 400 || error.response.status === 406) {
            Notification.BadRequest({
              errs: error.response.data
            })

            return error.response
          }

          // 4xx Errors
          if (error.response.status > 400 && error.response.status < 500) {
            if (error.response.data && error.response.data.detail) {
              Notification.Error({
                msg: error.response.data.detail
              })
            } else {
              Notification.Error({
                msg: 'Something went wrong...!'
              })
            }
            if (error.response.status === 429) {
              return error.response
            }

            return
          }

          // 5xx Errors
          if (error.response.status >= 500 && error.response.status <= 599) {
            Notification.Error({
              msg: 'Something went wrong...!'
            })

            return
          }
        } else {
          return error.response
        }
      })
  }
}
