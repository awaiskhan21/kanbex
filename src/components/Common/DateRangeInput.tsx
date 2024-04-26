import DateInput from './DateInput'

export type DateRange = {
  start: Date | undefined
  end: Date | undefined
}

type Props = {
  value?: DateRange | undefined
  onChange: (value: DateRange) => void
  className?: string
  disabled?: boolean | undefined
}

const DateRangeInput = ({ value, onChange, className, disabled }: Props) => {
  const { start, end } = value ?? { start: undefined, end: undefined }

  return (
    <div className="flex gap-2">
      <div className="flex-auto">
        <DateInput
          className={className}
          disabled={disabled}
          placeholder="Start date"
          position="RIGHT"
          value={start}
          onChange={(start) => onChange({ start, end })}
        />
      </div>
      <div className="flex-auto">
        <DateInput
          className={className}
          disabled={disabled || !start}
          placeholder="End date"
          position="CENTER"
          value={end}
          onChange={(end) => onChange({ start, end })}
        />
      </div>
    </div>
  )
}

export default DateRangeInput
