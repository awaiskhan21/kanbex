import DateInput, { DatePickerPosition } from '../../DateInput'

import FormField from './FormField'
import {
  FormFieldBaseProps,
  resolveFormFieldChangeEventHandler,
  resolveFormFieldError
} from './Utils'

type Props = FormFieldBaseProps<Date> & {
  placeholder?: string
  position?: DatePickerPosition
}

const DateFormField = ({ position = 'CENTER', ...props }: Props) => {
  const handleChange = resolveFormFieldChangeEventHandler(props)
  const error = resolveFormFieldError(props)

  const bgColor = error ? 'bg-red-50' : 'bg-gray-200'
  const borderColor = error ? 'border-red-500' : 'border-gray-200'

  const { name } = props

  return (
    <FormField props={props}>
      <DateInput
        className={`${bgColor} ${borderColor}`}
        disabled={props.disabled}
        placeholder={props.placeholder}
        position={position}
        value={props.value}
        onChange={(value) => handleChange({ name, value })}
      />
    </FormField>
  )
}

export default DateFormField
