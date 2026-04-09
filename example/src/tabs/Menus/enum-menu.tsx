import { PillButton } from '../Views/pill-button'
import { SingleSelectModal } from '../Views/single-select-modal'

export function EnumMenu({
  title,
  label,
  active,
  visible,
  onOpen,
  onClose,
  selectedID,
  options,
  onSelect,
  clearOptionLabel,
  onClear,
}: {
  title: string
  label: string
  active: boolean
  visible: boolean
  onOpen: () => void
  onClose: () => void
  selectedID?: string | undefined
  options: { id: string; label: string }[]
  onSelect: (id: string) => void
  clearOptionLabel?: string | undefined
  onClear?: (() => void) | undefined
}) {
  return (
    <>
      <PillButton label={label} active={active} onPress={onOpen} />
      <SingleSelectModal
        visible={visible}
        onClose={onClose}
        title={title}
        selectedID={selectedID}
        options={options}
        onSelect={onSelect}
        clearOptionLabel={clearOptionLabel}
        onClear={onClear}
      />
    </>
  )
}
