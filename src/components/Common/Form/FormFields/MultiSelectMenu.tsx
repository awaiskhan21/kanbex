import React from 'react'
import { Listbox } from '@headlessui/react'

import { DropdownTransition } from '../../DropDown'

type OptionCallback<T, R = void> = (option: T) => R

type Props<T, V = T> = {
  id?: string
  options: T[]
  value: V[] | undefined
  placeholder?: React.ReactNode
  optionLabel: OptionCallback<T, React.ReactNode>
  optionSelectedLabel?: OptionCallback<T, React.ReactNode>
  optionDescription?: OptionCallback<T, React.ReactNode>
  optionIcon?: OptionCallback<T, React.ReactNode>
  optionValue?: OptionCallback<T, V>
  className?: string
  renderSelectedOptions?: OptionCallback<T[], React.ReactNode>
  onChange: OptionCallback<V[]>
}

const MultiSelectMenu = <T, V>(props: Props<T, V>) => {
  const options = props.options.map((option) => {
    const label = props.optionLabel(option)
    const selectedLabel = props.optionSelectedLabel ? props.optionSelectedLabel(option) : label

    const value = props.optionValue ? props.optionValue(option) : option

    return {
      option,
      label,
      selectedLabel,
      description: props.optionDescription && props.optionDescription(option),
      icon: props.optionIcon && props.optionIcon(option),
      value,
      isSelected: props.value?.includes(value as any) ?? false,
      displayChip: (
        <div className="rounded-full border border-gray-400 bg-gray-100 px-2 text-xs text-gray-900">
          {selectedLabel}
        </div>
      )
    }
  })

  const placeholder = props.placeholder ?? 'Select'
  const selectedOptions = options.filter((o) => o.isSelected)

  const Placeholder: () => any = () => {
    if (selectedOptions.length === 0) return placeholder
    if (props.renderSelectedOptions)
      return props.renderSelectedOptions(selectedOptions.map((o) => o.option))

    return <span className="text-gray-700">{`${selectedOptions.length} items selected`}</span>
  }

  return (
    <div className={props.className}>
      <Listbox
        multiple
        value={selectedOptions}
        onChange={(opts: typeof options) => props.onChange(opts.map((o) => o.value) as any)}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="sr-only">{props.placeholder}</Listbox.Label>
            <div className="relative">
              <div className="">
                <Listbox.Button className="flex w-full rounded border-2 bg-gray-200 outline-none ring-0 transition-all duration-200 ease-in-out focus:border-zinc-400">
                  <div className="relative z-0 flex w-full items-center">
                    <div className="relative flex flex-1 items-center py-3 pl-3 pr-4 focus:z-10">
                      <p className="ml-2.5 text-sm font-normal text-gray-500">
                        <Placeholder />
                      </p>
                    </div>
                    <i className="fa-solid fa-chevron-down mr-2 p-2 text-sm" />
                  </div>
                </Listbox.Button>
                {selectedOptions.length !== 0 && (
                  <div className="flex flex-wrap gap-2 p-2">
                    {selectedOptions.map((option, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-gray-400 bg-gray-200 px-2 py-1 text-xs text-gray-800"
                      >
                        {option.selectedLabel}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <DropdownTransition show={open}>
                <Listbox.Options className="absolute top-12 z-10 mt-2 max-h-96 w-full divide-y divide-gray-300 overflow-auto rounded-md bg-gray-100 shadow-lg ring-1 ring-gray-400 focus:outline-none xl:rounded-lg">
                  {options.map((option, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `cursor-default select-none relative p-4 text-sm transition-all duration-100 ease-in-out ${
                          active ? 'text-white bg-primary-500' : 'text-gray-900'
                        }`
                      }
                      id={`${props.id}-option-${index}`}
                      value={option}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p className={selected ? 'font-semibold' : 'font-normal'}>
                              {option.label}
                            </p>
                            {(option.icon || option.isSelected) && (
                              <span
                                className={`transition-all duration-100 ease-in-out ${
                                  active ? 'text-white' : 'text-primary-500'
                                }`}
                              >
                                {option.isSelected ? (
                                  <i className="fa-solid fa-check" />
                                ) : (
                                  option.icon
                                )}
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className={`mt-2 ${active ? 'text-primary-200' : 'text-gray-500'}`}>
                              {option.description}
                            </p>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </DropdownTransition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default MultiSelectMenu
