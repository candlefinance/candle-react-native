import type { LinkedAccount } from 'react-native-candle'
import { getLinkedAccountTitle } from '../Extensions/linked-account'
import { displayService } from '../Extensions/service'
import { MultiSelectModal } from '../Views/multi-select-modal'
import { PillButton } from '../Views/pill-button'

export function LinkedAccountsMenu({
  linkedAccounts,
  selectedLinkedAccountIDs,
  visible,
  onOpen,
  onClose,
  onToggle,
}: {
  linkedAccounts: LinkedAccount[]
  selectedLinkedAccountIDs: string[]
  visible: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: (id: string) => void
}) {
  return (
    <>
      <PillButton
        label="Linked Accounts"
        active={selectedLinkedAccountIDs.length > 0}
        onPress={onOpen}
      />
      <MultiSelectModal
        visible={visible}
        onClose={onClose}
        title="Linked Accounts"
        options={linkedAccounts.map((account) => ({
          id: account.linkedAccountID,
          label: `${displayService(account.service)} (${getLinkedAccountTitle(account)})`,
        }))}
        selected={selectedLinkedAccountIDs}
        onToggle={onToggle}
      />
    </>
  )
}
