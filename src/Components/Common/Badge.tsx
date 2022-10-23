import type { MouseEventHandler } from 'react'
import 'clsx'

interface Props {
  color?: string
  startIcon?: string
  endIcon?: string
  text: string
  onStartIconClick?: MouseEventHandler<HTMLElement>
  onEndIconClick?: MouseEventHandler<HTMLElement>
}

export function Badge(props: Props) {
  return (
    <span
      className={`border- inline-flex border${props.color}-300 bg- items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium leading-4${props.color}-100 text- text-gray-800${props.color}-900`}
      title={props.text}
    >
      {props.startIcon && (
        <i
          className={`text-md text-${props.color}-500 fas fa-${props.startIcon}`}
          onClick={props.onEndIconClick}
        />
      )}
      {props.text}
      {props.endIcon && (
        <i
          className={`text-md text-${props.color}-500 fas fa-${props.endIcon}`}
          onClick={props.onEndIconClick}
        />
      )}
    </span>
  )
}
