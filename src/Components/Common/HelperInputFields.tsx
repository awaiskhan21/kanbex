import type { TextFieldProps } from '@mui/material'

import { TextField } from '@mui/material'

type TextFieldPropsExtended = TextFieldProps & { errors: string }

export const TextInputField = (props: TextFieldPropsExtended) => {
  const { onChange, type, errors, onKeyDown } = props
  const inputType = type === 'number' || type === 'float' ? 'text' : type
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange !== 'function') {
      return
    }
    if (type === 'number' && event.target.value) {
      event.target.value = event.target.value.replace(/\D/, '')
    }
    if (type === 'float' && event.target.value) {
      event.target.value = event.target.value.replace(/(?!\.)\D/, '')
    }
    onChange(event)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof onKeyDown !== 'function') {
      return
    }
    onKeyDown(event)
  }

  return (
    <div>
      <TextField
        {...props}
        fullWidth
        type={inputType}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <ErrorHelperText error={errors} />
    </div>
  )
}

export const ErrorHelperText = (props: { error?: string }) => {
  const { error } = props

  return (
    <span
      className={`error-text mt-2 ml-1 transition-all duration-300 ${
        error ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {error}
    </span>
  )
}
