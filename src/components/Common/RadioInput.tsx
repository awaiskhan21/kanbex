import { ErrorHelperText } from './HelperInputFields'

type RadioValue = string | ReadonlyArray<string> | number | undefined

interface Props<T extends RadioValue> {
  className?: string
  label?: string
  name?: string
  options: {
    label: React.ReactNode
    value: T
  }[]
  onSelect: (value: T) => void
  selected?: T
  error?: string
  required?: boolean
}

export default function RadioInputsV2<T extends RadioValue>(props: Props<T>) {
  return (
    <div className={props.className}>
      {props.label && (
        <label htmlFor={props.name}>
          {props.label}
          {props.required && ' *'}
        </label>
      )}
      <div className="flex gap-4 p-4">
        {props.options.map((option, idx) => {
          return (
            <div key={idx} className="flex items-center gap-2">
              <input
                checked={option.value === props.selected}
                className="h-4 w-4 rounded-full border-gray-300 text-zinc-600 focus:ring-2 focus:ring-zinc-500"
                id={`${props.name}-${idx}`}
                name={props.name}
                type="radio"
                value={option.value}
                onChange={() => props.onSelect(option.value)}
              />
              <label htmlFor={`${props.name}-${idx}`}>{option.label}</label>
            </div>
          )
        })}
      </div>
      <ErrorHelperText error={props.error} />
    </div>
  )
}
