import { ErrorHelperText } from './HelperInputFields'

type SwitchProps<T> = {
  name?: string
  className?: string
  label?: string
  value?: T
  options: T[]
  optionLabel?: (option: T) => string
  optionClassName?: (option: T) => string | false
  required?: boolean
  onChange: (option: T) => void
  error?: string
}

export default function SwitchV2<T>(props: SwitchProps<T>) {
  return (
    <div className={props.className}>
      {props.label && (
        <label className="mb-3" htmlFor="is_working">
          {props.label}
          {props.required && ' *'}
        </label>
      )}
      <ul className="flex" role="list">
        {props.options.map((option, index) => {
          const selected = option === props.value
          const additionalClassNames = selected
            ? (props.optionClassName && props.optionClassName(option)) ||
              'bg-zinc-500 hover:bg-zinc-600 text-white border-zinc-500 focus:ring-zinc-500 focus:border-zinc-500'
            : 'bg-gray-50 hover:bg-gray-200 border-gray-400 focus:ring-zinc-500 focus:border-zinc-500'

          return (
            <li
              key={index}
              className={`cursor-pointer border p-2 px-4 shadow-sm outline-none transition-all duration-200 ease-in-out first:rounded-l-lg last:rounded-r-lg focus:ring-1 ${additionalClassNames}`}
              tabIndex={0}
              onClick={() => props.onChange(option)}
            >
              <span className={`select-none text-sm ${selected ? 'font-semibold' : 'font-normal'}`}>
                {(props.optionLabel && props.optionLabel(option)) || String(option)}
              </span>
            </li>
          )
        })}
      </ul>
      <ErrorHelperText error={props.error} />
    </div>
  )
}
