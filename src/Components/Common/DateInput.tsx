import { useState, useEffect } from 'react'
import {
  format,
  subMonths,
  addMonths,
  subYears,
  addYears,
  isEqual,
  getDaysInMonth,
  getDay
} from 'date-fns'
import clsx from 'clsx'
import { Popover } from '@headlessui/react'

import { DropdownTransition } from './DropDown'

type DatePickerType = 'date' | 'month' | 'year'
export type DatePickerPosition = 'LEFT' | 'RIGHT' | 'CENTER'

interface Props {
  className?: string
  value: Date | undefined
  onChange: (date: Date) => void
  position?: DatePickerPosition
  disabled?: boolean
  placeholder?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const DateInput: React.FC<Props> = ({
  className,
  value,
  onChange,
  position,
  disabled,
  placeholder
}) => {
  const [dayCount, setDayCount] = useState<Array<number>>([])
  const [blankDays, setBlankDays] = useState<Array<number>>([])

  const [datePickerHeaderDate, setDatePickerHeaderDate] = useState(new Date())
  const [type, setType] = useState<DatePickerType>('date')
  const [year, setYear] = useState(new Date())

  const decrement = () => {
    switch (type) {
      case 'date':
        setDatePickerHeaderDate((prev) => subMonths(prev, 1))
        break
      case 'month':
        setDatePickerHeaderDate((prev) => subYears(prev, 1))
        break
      case 'year':
        setDatePickerHeaderDate((prev) => subYears(prev, 1))
        setYear((prev) => subYears(prev, 10))
        break
    }
  }

  const increment = () => {
    switch (type) {
      case 'date':
        setDatePickerHeaderDate((prev) => addMonths(prev, 1))
        break
      case 'month':
        setDatePickerHeaderDate((prev) => addYears(prev, 1))
        break
      case 'year':
        setDatePickerHeaderDate((prev) => addYears(prev, 1))
        setYear((prev) => addYears(prev, 10))
        break
    }
  }

  const isSelectedDate = (date: number) => {
    if (value) return isEqual(new Date(value.getFullYear(), value.getMonth(), date), value)
  }

  const setDateValue = (date: number) => () => {
    onChange(new Date(datePickerHeaderDate.getFullYear(), datePickerHeaderDate.getMonth(), date))
  }

  const getDayCount = (date: Date) => {
    const daysInMonth = getDaysInMonth(date)

    const dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1))
    const blankDaysArray = []

    for (let i = 1; i <= dayOfWeek; i++) {
      blankDaysArray.push(i)
    }

    const daysArray = []

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i)
    }

    setBlankDays(blankDaysArray)
    setDayCount(daysArray)
  }

  const isSelectedMonth = (month: number) => month === datePickerHeaderDate.getMonth()

  const isSelectedYear = (year: number) => year === datePickerHeaderDate.getFullYear()

  const setMonthValue = (month: number) => () => {
    setDatePickerHeaderDate(
      new Date(datePickerHeaderDate.getFullYear(), month, datePickerHeaderDate.getDate())
    )
    setType('date')
  }

  const setYearValue = (year: number) => () => {
    setDatePickerHeaderDate(
      new Date(year, datePickerHeaderDate.getMonth(), datePickerHeaderDate.getDate())
    )
    setType('date')
  }

  const showMonthPicker = () => setType('month')

  const showYearPicker = () => setType('year')

  useEffect(() => {
    getDayCount(datePickerHeaderDate)
  }, [datePickerHeaderDate])

  const getPosition = () => {
    switch (position) {
      case 'LEFT':
        return 'left-0'
      case 'RIGHT':
        return 'right-0 transform translate-x-1/2'
      case 'CENTER':
        return 'transform -translate-x-1/2'
      default:
        return 'left-0'
    }
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-[0.8]' : ''}>
      <div className="container mx-auto text-black">
        <Popover className="relative">
          <Popover.Button className="w-full">
            <input name="date" type="hidden" />
            <input
              readOnly
              className={clsx('form-input', className)}
              placeholder={placeholder ? placeholder : 'Select date'}
              type="text"
              value={value && format(value, 'yyyy-MM-dd')}
            />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer p-2">
              <i className="fa-regular fa-calendar text-slate-500" />
            </div>
          </Popover.Button>
          <DropdownTransition>
            <Popover.Panel
              className={clsx(
                'absolute top-[110%] z-10 w-72 rounded-lg border border-slate-300 bg-white p-4 shadow',
                getPosition()
              )}
            >
              <div className="mb-4 flex w-full items-center justify-between">
                <button
                  className="inline-flex aspect-square cursor-pointer items-center justify-center rounded p-2 transition duration-100 ease-in-out  hover:bg-slate-200"
                  type="button"
                  onClick={decrement}
                >
                  <i className="fa fa-arrow-left" />
                </button>

                <div className="flex items-center justify-center text-sm">
                  {type === 'date' && (
                    <div
                      className="cursor-pointer rounded py-1 px-3 text-center font-bold text-slate-900 hover:bg-slate-200"
                      onClick={showMonthPicker}
                    >
                      {format(datePickerHeaderDate, 'MMMM')}
                    </div>
                  )}
                  <div
                    className="cursor-pointer rounded py-1 px-3 font-bold text-gray-900 hover:bg-slate-200"
                    onClick={showYearPicker}
                  >
                    <p className="text-center">
                      {type == 'year' ? year.getFullYear() : format(datePickerHeaderDate, 'yyyy')}
                    </p>
                  </div>
                </div>
                <button
                  className="inline-flex aspect-square h-full cursor-pointer items-center justify-center rounded p-2 transition duration-100 ease-in-out hover:bg-slate-200"
                  disabled={type === 'year' && new Date().getFullYear() === year.getFullYear()}
                  type="button"
                  onClick={increment}
                >
                  <i className="fa fa-arrow-right" />
                </button>
              </div>
              {type === 'date' && (
                <>
                  <div className="flex flex-wrap">
                    {DAYS.map((day) => (
                      <div key={day} className="aspect-square w-[14.26%]">
                        <div className="text-center text-sm font-medium text-slate-600">{day}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap">
                    {blankDays.map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square w-[14.26%] border border-transparent p-1 text-center text-sm"
                      />
                    ))}
                    {dayCount.map((d, i) => (
                      <div key={i} className="aspect-square w-[14.26%]">
                        <div
                          className={clsx(
                            'flex h-full cursor-pointer items-center justify-center rounded text-center text-sm leading-loose text-slate-900 transition duration-100 ease-in-out hover:bg-slate-200',
                            value && isSelectedDate(d) && 'bg-zinc-500 font-bold text-slate-100'
                          )}
                          onClick={setDateValue(d)}
                        >
                          {d}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {type === 'month' && (
                <div className="flex flex-wrap">
                  {Array(12)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          'w-1/4 cursor-pointer rounded-lg py-4 px-2 text-center text-sm font-semibold hover:bg-slate-200',
                          value && isSelectedMonth(i)
                            ? 'bg-zinc-500 text-white'
                            : 'text-slate-700 hover:bg-zinc-600'
                        )}
                        onClick={setMonthValue(i)}
                      >
                        {format(
                          new Date(
                            datePickerHeaderDate.getFullYear(),
                            i,
                            datePickerHeaderDate.getDate()
                          ),
                          'MMM'
                        )}
                      </div>
                    ))}
                </div>
              )}
              {type === 'year' && (
                <div className="flex flex-wrap">
                  {Array(12)
                    .fill(null)
                    .map((_, i) => {
                      const y = year.getFullYear() - 11 + i

                      return (
                        <div
                          key={i}
                          className={clsx(
                            'w-1/4 cursor-pointer rounded-lg py-4 px-2 text-center text-sm font-semibold hover:bg-slate-200',
                            value && isSelectedYear(y)
                              ? 'bg-zinc-500 text-white'
                              : 'text-slate-700 hover:bg-zinc-600'
                          )}
                          onClick={setYearValue(y)}
                        >
                          {y}
                        </div>
                      )
                    })}
                </div>
              )}
            </Popover.Panel>
          </DropdownTransition>
        </Popover>
      </div>
    </div>
  )
}

DateInput.defaultProps = {
  position: 'CENTER',
  className: 'bg-gray-200 border-gray-200'
}

export default DateInput
