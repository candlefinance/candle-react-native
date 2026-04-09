import type { Counterparty } from 'react-native-candle'
import type { BadgeChip } from '../Models/badge-chip'
import { displayService, getServiceLogo } from './service'

export const displayCounterpartyKind = (kind: Counterparty['kind']): string => {
  switch (kind) {
    case 'merchant': {
      return 'Merchant'
    }
    case 'service': {
      return 'Service'
    }
    case 'user': {
      return 'User'
    }
  }
}

export const getCounterpartyKindBadge = (input: {
  kind: Counterparty['kind']
  id?: string
}): BadgeChip => {
  switch (input.kind) {
    case 'merchant': {
      return {
        id: input.id ?? 'counterparty',
        text: displayCounterpartyKind(input.kind),
        tone: 'cyan',
      }
    }
    case 'service': {
      return {
        id: input.id ?? 'counterparty',
        text: displayCounterpartyKind(input.kind),
        tone: 'purple',
      }
    }
    case 'user': {
      return {
        id: input.id ?? 'counterparty',
        text: displayCounterpartyKind(input.kind),
        tone: 'brown',
      }
    }
  }
}

export function getCounterpartyBadge(counterparty: Counterparty): BadgeChip {
  return getCounterpartyKindBadge({ kind: counterparty.kind })
}

export function getCounterpartyTitle(counterparty: Counterparty): string {
  switch (counterparty.kind) {
    case 'merchant': {
      return counterparty.name
    }
    case 'service': {
      return displayService(counterparty.service)
    }
    case 'user': {
      return counterparty.legalName
    }
  }
}

export function getCounterpartyImage(counterparty: Counterparty): string {
  switch (counterparty.kind) {
    case 'merchant': {
      return counterparty.logoURL
    }
    case 'service': {
      return getServiceLogo(counterparty.service)
    }
    case 'user': {
      return counterparty.avatarURL
    }
  }
}
