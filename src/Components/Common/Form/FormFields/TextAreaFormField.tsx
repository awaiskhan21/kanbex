import FormField from './FormField'
import {
  FormFieldBaseProps,
  resolveFormFieldChangeEventHandler,
  resolveFormFieldError
} from './Utils'

type TextAreaFormFieldProps = FormFieldBaseProps<string> & {
  placeholder?: string
  value?: string | number
  rows?: number
  // prefixIcon?: React.ReactNode;
  // suffixIcon?: React.ReactNode;
}

const TextAreaFormField = ({ rows = 3, ...props }: TextAreaFormFieldProps) => {
  const handleChange = resolveFormFieldChangeEventHandler(props)
  const error = resolveFormFieldError(props)

  const bgColor = error ? 'bg-red-50' : 'bg-gray-200'
  const borderColor = error ? 'border-red-500' : 'border-gray-200'

  return (
    <FormField props={props}>
      <textarea
        className={`form-textarea ${bgColor} ${borderColor}`}
        disabled={props.disabled}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
        rows={rows}
        value={props.value}
        onChange={(event) => {
          event.preventDefault()
          handleChange(event.target)
        }}
      />
    </FormField>
  )
}

export default TextAreaFormField
