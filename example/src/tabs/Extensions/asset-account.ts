import type { ACHDetails, AssetAccount } from 'react-native-candle'
import type { BadgeChip } from '../Models/badge-chip'
import { getAssetKindBadge } from './trade-asset'

export const displayAccountKind = (accountKind: AssetAccount['accountKind']): string => {
  switch (accountKind) {
    case 'business': {
      return 'Business'
    }
    case 'individual': {
      return 'Individual'
    }
    case 'joint': {
      return 'Joint'
    }
    case 'rothIRA': {
      return 'Roth IRA'
    }
    case 'traditionalIRA': {
      return 'Traditional IRA'
    }
  }
}

export const displayACHAccountKind = (accountKind: ACHDetails['accountKind']): string => {
  switch (accountKind) {
    case 'checking': {
      return 'Checking'
    }
    case 'savings': {
      return 'Savings'
    }
  }
}

export function getAssetAccountBadges(account: AssetAccount): BadgeChip[] {
  return [getAssetKindBadge({ assetKind: account.assetKind })]
}
