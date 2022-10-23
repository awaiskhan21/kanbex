import React from 'react'
import { Listbox } from '@headlessui/react'

import { DropdownTransition } from '../../DropDown'

type OptionCallback<T, R> = (option: T) => R

type SelectMenuProps<T, V = T> = {
  id?: string
  options: T[]
  value: V | undefined
  placeholder?: React.ReactNode
  optionLabel: OptionCallback<T, React.ReactNode>
  optionSelectedLabel?: OptionCallback<T, React.ReactNode>
  optionDescription?: OptionCallback<T, React.ReactNode>
  optionIcon?: OptionCallback<T, React.ReactNode>
  optionValue?: OptionCallback<T, V>
  className?: string
} & (
  | {
      required?: false
      onChange: OptionCallback<V | undefined, void>
    }
  | {
      required: true
      onChange: OptionCallback<V, void>
    }
)

const SelectMenu = <T, V>(props: SelectMenuProps<T, V>) => {
  const valueOptions = props.options.map((option) => {
    const label = props.optionLabel(option)

    return {
      label,
      selectedLabel: props.optionSelectedLabel ? props.optionSelectedLabel(option) : label,
      description: props.optionDescription && props.optionDescription(option),
      icon: props.optionIcon && props.optionIcon(option),
      value: props.optionValue ? props.optionValue(option) : option
    }
  })

  const placeholder = props.placeholder ?? 'Select'
  const defaultOption = {
    label: placeholder,
    selectedLabel: <p className="font-normal text-gray-500">{placeholder}</p>,
    description: undefined,
    icon: undefined,
    value: undefined
  }

  const options = props.required ? valueOptions : [defaultOption, ...valueOptions]

  const value = options.find((o) => props.value == o.value) || defaultOption

  return (
    <div className={props.className}>
      <Listbox value={value} onChange={(selection: any) => props.onChange(selection.value)}>
        {({ open }) => (
          <>
            <Listbox.Label className="sr-only">{props.placeholder}</Listbox.Label>
            <div className="relative">
              <Listbox.Button className="flex w-full rounded border-2 bg-gray-200 outline-none ring-0 transition-all duration-200 ease-in-out focus:border-zinc-400">
                <div className="relative z-0 flex w-full items-center">
                  <div className="relative flex flex-1 items-center py-3 pl-3 pr-4 focus:z-10">
                    <div className="ml-2 text-sm text-gray-700">{value.icon}</div>
                    <p className="ml-2.5 text-sm font-medium">{value.selectedLabel}</p>
                  </div>
                  <i className="fa-solid fa-chevron-down mr-2 p-2 text-sm" />
                </div>
              </Listbox.Button>
              <DropdownTransition show={open}>
                <Listbox.Options className="absolute z-10 mt-2 max-h-96 w-full origin-top-right divide-y divide-gray-300 overflow-auto rounded-md bg-gray-100 shadow-lg ring-1 ring-gray-400 focus:outline-none xl:rounded-lg">
                  {options.map((option, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `cursor-default select-none relative p-4 text-sm transition-all duration-100 ease-in-out ${
                          active ? 'text-white bg-primary-500' : 'text-gray-900'
                        }`
                      }
                      id={`${props.id}-option-${option.value}`}
                      value={option}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p className={selected ? 'font-semibold' : 'font-normal'}>
                              {option.label}
                            </p>
                            {option.icon && (
                              <span
                                className={`transition-all duration-100 ease-in-out ${
                                  active ? 'text-white' : 'text-primary-500'
                                }`}
                              >
                                {option.icon}
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

export default SelectMenu
