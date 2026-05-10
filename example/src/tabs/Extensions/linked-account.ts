import type { LinkedAccount, LinkedAccountStatusRef } from 'react-native-candle'
import type { BadgeChip } from '../Models/badge-chip'

export const displayLinkedAccountState = (
  state: LinkedAccount['details']['state'] | LinkedAccountStatusRef['state'],
): string => {
  switch (state) {
    case 'active': {
      return 'Active'
    }
    case 'inactive': {
      return 'Inactive'
    }
    case 'unavailable': {
      return 'Unavailable'
    }
  }
}

export const getLinkedAccountStateBadge = (
  state: LinkedAccount['details']['state'] | LinkedAccountStatusRef['state'],
): BadgeChip => ({
  id: 'state',
  text: displayLinkedAccountState(state),
  tone: state === 'active' ? 'green' : state === 'unavailable' ? 'yellow' : 'red',
})

export function getLinkedAccountBadges(
  linkedAccount: Pick<LinkedAccount, 'details'> | Pick<LinkedAccountStatusRef, 'state'>,
): BadgeChip[] {
  return [
    getLinkedAccountStateBadge(
      'details' in linkedAccount ? linkedAccount.details.state : linkedAccount.state,
    ),
  ]
}

export function getLinkedAccountTitle(account: {
  details: { state: string; legalName?: string }
  serviceUserID: string
}): string {
  if (account.details.state === 'active' && account.details.legalName !== undefined) {
    return account.details.legalName
  }
  return account.serviceUserID
}
