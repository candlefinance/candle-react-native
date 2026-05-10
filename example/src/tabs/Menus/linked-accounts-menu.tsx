import { useEffect, useState } from 'react'
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
  onChange,
}: {
  linkedAccounts: LinkedAccount[]
  selectedLinkedAccountIDs: string[]
  visible: boolean
  onOpen: () => void
  onClose: () => void
  onChange: (ids: string[]) => void
}) {
  const [draftSelectedLinkedAccountIDs, setDraftSelectedLinkedAccountIDs] =
    useState<string[]>(selectedLinkedAccountIDs)

  useEffect(() => {
    if (!visible) {
      setDraftSelectedLinkedAccountIDs(selectedLinkedAccountIDs)
    }
  }, [selectedLinkedAccountIDs, visible])

  return (
    <>
      <PillButton
        label="Linked Accounts"
        active={selectedLinkedAccountIDs.length > 0}
        onPress={() => {
          setDraftSelectedLinkedAccountIDs(selectedLinkedAccountIDs)
          onOpen()
        }}
      />
      <MultiSelectModal
        visible={visible}
        onClose={() => {
          onChange(draftSelectedLinkedAccountIDs)
          onClose()
        }}
        title="Linked Accounts"
        options={linkedAccounts.map((account) => ({
          id: account.linkedAccountID,
          label: `${displayService(account.service)} (${getLinkedAccountTitle(account)})`,
        }))}
        selected={visible ? draftSelectedLinkedAccountIDs : selectedLinkedAccountIDs}
        onToggle={(id) => {
          setDraftSelectedLinkedAccountIDs((current) =>
            current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
          )
        }}
      />
    </>
  )
}
