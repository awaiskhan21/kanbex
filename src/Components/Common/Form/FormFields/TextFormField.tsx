import FormField from './FormField'
import {
  FormFieldBaseProps,
  resolveFormFieldChangeEventHandler,
  resolveFormFieldError
} from './Utils'

type Props = FormFieldBaseProps<string> & {
  placeholder?: string
  value?: string | number
  autoComplete?: string
  type?: 'email' | 'password' | 'search' | 'text'
  // prefixIcon?: React.ReactNode;
  // suffixIcon?: React.ReactNode;
}

const TextFormField = (props: Props) => {
  const handleChange = resolveFormFieldChangeEventHandler(props)
  const error = resolveFormFieldError(props)

  const bgColor = error ? 'bg-red-50' : 'bg-gray-200'
  const borderColor = error ? 'border-red-500' : 'border-gray-200'

  return (
    <FormField props={props}>
      <input
        autoComplete={props.autoComplete}
        className={`form-input ${bgColor} ${borderColor}`}
        disabled={props.disabled}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
        type={props.type || 'text'}
        value={props.value}
        onChange={(event) => {
          event.preventDefault()
          handleChange(event.target)
        }}
      />
    </FormField>
  )
}

export default TextFormField
