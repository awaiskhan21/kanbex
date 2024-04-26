import { ErrorHelperText } from './HelperInputFields'

type BaseProps = {
  name?: string
  id?: string
  autoComplete?: string
  type?: 'email' | 'password' | 'search' | 'text'
  label?: string
  placeholder?: string
  value?: string | number
  onValueChange?: (value: string) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  className?: string
}

type Props =
  | (BaseProps & {
      onValueChange?: (value: string) => void
    })
  | (BaseProps & {
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    })

export default function TextInputField(props: Props) {
  const { onChange, onValueChange } = props

  return (
    <div>
      {props.label && (
        <label className="mb-2" htmlFor={props.id}>
          {props.label + ((props.required && ' *') || '')}
        </label>
      )}
      <input
        autoComplete={props.autoComplete || props.name || props.id}
        className={`input block w-full${(props.error && 'border-error') || ''}`}
        id={props.id}
        name={props.name || props.id}
        placeholder={props.placeholder}
        type={props.type || 'text'}
        value={props.value}
        onChange={onChange || ((e) => onValueChange && onValueChange(e.target.value))}
      />
      <ErrorHelperText error={props.error} />
    </div>
  )
}
