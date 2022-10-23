import Button from './Button'

type Callback = () => void
type Props = {
  onClose: Callback
  onClear: Callback
  onApply: Callback
}

const FilterButtons = ({ onClose, onClear, onApply }: Props) => {
  return (
    <div className="fixed z-10 mb-4 -ml-4 -mt-8 flex w-full max-w-sm items-center bg-gray-50 pl-4 pr-8 pt-8 pb-4">
      <Button ghost variant="secondary" onClick={onClose}>
        <i className="fa-solid fa-xmark text-base" /> Cancel
      </Button>
      <Button ghost variant="danger" onClick={onClear}>
        <i className="fa-solid fa-xmark text-base" /> Clear Filter
      </Button>
      <div className="flex-1" />
      <Button onClick={onApply}>Apply</Button>
    </div>
  )
}

export default FilterButtons
