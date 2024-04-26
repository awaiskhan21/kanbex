import React, { useEffect, useState, useMemo } from 'react'
import { Combobox } from '@headlessui/react'
import { debounce } from 'lodash'

import Spinner from '../Spinner'
import { DropdownTransition } from '../DropDown'

interface Props {
  name?: string
  selected: any | any[]
  fetchData: (search: string) => Promise<any> | undefined
  onChange: (selected: any) => void
  optionLabel?: (option: any) => string
  showNOptions?: number
  multiple?: boolean
  debounceTime?: number
  className?: string
  placeholder?: string
  error?: string
}

const AutoCompleteAsync = (props: Props) => {
  const {
    name,
    selected,
    fetchData,
    onChange,
    optionLabel = (option: any) => option.label,
    showNOptions = 10,
    multiple = false,
    debounceTime = 300,
    className = '',
    placeholder,
    error
  } = props
  const [data, setData] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const getPlaceholder = () => {
    if (!multiple && selected) return optionLabel(selected)
    if (multiple && selected?.length > 0) return `${selected.length} selected`

    return placeholder || 'Start typing to search...'
  }

  const hasSelection = (!multiple && selected) || (multiple && selected?.length > 0)

  const fetchDataAsync = useMemo(
    () =>
      debounce(async (query: string) => {
        setLoading(true)
        const data = await fetchData(query)

        setData(data?.slice(0, showNOptions) || [])
        setLoading(false)
      }, debounceTime),
    [fetchData, showNOptions, debounceTime]
  )

  useEffect(() => {
    fetchDataAsync(query)
  }, [query, fetchDataAsync])

  const WrappedCombobox = (props: { children: any }) => {
    return multiple ? (
      <Combobox multiple name={name} value={selected} onChange={onChange}>
        {props.children}
      </Combobox>
    ) : (
      <Combobox name={name} value={selected} onChange={onChange}>
        {props.children}
      </Combobox>
    )
  }

  return (
    <div className={className}>
      <WrappedCombobox>
        <div className="relative mt-1">
          <div className="flex w-full rounded border-2 bg-gray-200 outline-none ring-0 transition-all duration-200 ease-in-out focus:border-zinc-400">
            <Combobox.Button className="block w-full py-1 pl-3 pr-10 focus:outline-none focus:ring-0 sm:text-sm">
              <Combobox.Input
                className={`w-full border-none text-sm leading-5 text-gray-900 ${
                  hasSelection
                    ? 'font-medium placeholder:text-gray-900'
                    : 'placeholder:text-gray-500'
                } bg-inherit shadow-none focus:ring-0`}
                placeholder={getPlaceholder()}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {loading && <Spinner path={{ fill: 'black' }} />}
                <i className="fa-solid fa-chevron-down mr-2 p-2 text-sm" />
              </div>
            </Combobox.Button>
          </div>
          <DropdownTransition afterLeave={() => setQuery('')}>
            <Combobox.Options className="absolute top-12 z-10 mt-2 max-h-96 w-full divide-y divide-gray-300 overflow-auto rounded-md bg-gray-100 text-sm shadow-lg ring-1 ring-gray-400 focus:outline-none xl:rounded-lg">
              {data?.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  {query !== '' ? 'Nothing found.' : 'Start typing to search...'}
                </div>
              ) : (
                data?.map((item: any) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'text-white bg-primary-500' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {optionLabel(item)}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-primary-500'
                            }`}
                          >
                            <i className="fa-solid fa-check" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </DropdownTransition>
          {multiple && selected?.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2">
              {selected?.map((option: any, idx: number) => (
                <span
                  key={idx}
                  className="rounded-full border border-gray-400 bg-gray-200 px-2 py-1 text-xs text-gray-800"
                >
                  {optionLabel(option)}
                  <i
                    className="fa-solid fa-x ml-1 h-3 w-3 cursor-pointer text-gray-700"
                    onClick={() => {
                      onChange(selected.filter((item: any) => item.id !== option.id))
                    }}
                  />
                </span>
              ))}
            </div>
          )}
          {error && <div className="mt-1 text-sm font-medium text-red-500">{error}</div>}
        </div>
      </WrappedCombobox>
    </div>
  )
}

export default AutoCompleteAsync
