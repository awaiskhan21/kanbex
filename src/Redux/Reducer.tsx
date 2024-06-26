import { actions } from './apiWrapper'

const reducer = (state = {}, changeAction: any) => {
  switch (changeAction.type) {
    case actions.FETCH_REQUEST: {
      const obj: any = Object.assign({}, state)

      obj[changeAction.key] = {
        error: false,
        isFetching: true
      }

      return obj
    }
    case actions.FETCH_REQUEST_SUCCESS: {
      const obj: any = Object.assign({}, state)

      obj[changeAction.key] = {
        data: changeAction.data,
        error: false,
        isFetching: false
      }

      return obj
    }
    case actions.FETCH_REQUEST_ERROR: {
      const obj: any = Object.assign({}, state)

      obj[changeAction.key] = {
        error: true,
        errorMessage: changeAction.error,
        isFetching: false
      }

      return obj
    }

    case actions.SET_DATA: {
      const obj: any = Object.assign({}, state)

      obj[changeAction.key] = changeAction.value

      return obj
    }

    default:
      return state
  }
}

export default reducer
