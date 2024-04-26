import React, { useCallback, useState, useEffect } from 'react'
import { TextFieldProps } from '@mui/material'
import debounce from 'lodash/debounce'

type TextFieldPropsExtended = TextFieldProps & {
  errors: string
  search: (value: string) => void
  value?: string
}
export const InputSearchBox = (props: TextFieldPropsExtended) => {
  const { search, placeholder, value } = props
  const [searchValue, setSearchValue] = useState(value)
  const handler = useCallback(debounce(search, 1200), [search])
  const handleKeyDown = (event: any) => {
    const { value } = event.target

    setSearchValue(value)
    if (value.length === 0 || value.length > 2) {
      handler(value)
    }
  }

  useEffect(() => {
    setSearchValue(value)
  }, [value])
  const clearSearch = () => {
    handler('')
    setSearchValue('')
  }
  const inputProps = {
    placeholder,
    onChange: handleKeyDown,
    value: searchValue
  }

  return (
    <div className="top-0 bg-gray-100 md:flex">
      <div className="relative w-full rounded-md lg:max-w-sm">
        <input
          name="search"
          type="text"
          {...inputProps}
          className="form-input pr-8 sm:text-sm sm:leading-5"
        />
        {searchValue ? (
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
            onClick={clearSearch}
          >
            <span className="text-gray-500 sm:text-sm sm:leading-5">
              <i className="fas fa-times text-md " />
            </span>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm sm:leading-5">
              <i className="fas fa-search text-md " />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
