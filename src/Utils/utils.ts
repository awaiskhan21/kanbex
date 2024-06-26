import { navigate } from 'raviger'

export const goBack = (deltaOrUrl?: string | number | false | void) => {
  if (typeof deltaOrUrl === 'number') {
    window.history.go(-deltaOrUrl)

    return
  }

  if (typeof deltaOrUrl === 'string') {
    navigate(deltaOrUrl)

    return
  }

  window.history.back()
}
