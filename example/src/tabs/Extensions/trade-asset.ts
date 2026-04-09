import type { TradeAsset, TradeAssetRef } from 'react-native-candle'
import type { BadgeChip, BadgeTone } from '../Models/badge-chip'
import { formatMoney } from './format'

export const displayTradeAssetKind = (assetKind: TradeAsset['assetKind']): string => {
  switch (assetKind) {
    case 'crypto': {
      return 'Crypto'
    }
    case 'fiat': {
      return 'Fiat'
    }
    case 'nothing': {
      return 'Nothing'
    }
    case 'event': {
      return 'Event'
    }
    case 'other': {
      return 'Other'
    }
    case 'stock': {
      return 'Stock'
    }
    case 'transport': {
      return 'Transport'
    }
  }
}

const getAssetKindTone = (assetKind: TradeAsset['assetKind']): BadgeTone => {
  switch (assetKind) {
    case 'fiat': {
      return 'teal'
    }
    case 'crypto': {
      return 'orange'
    }
    case 'stock': {
      return 'maroon'
    }
    case 'transport': {
      return 'black'
    }
    case 'event': {
      return 'cyan'
    }
    case 'nothing': {
      return 'crimson'
    }
    case 'other': {
      return 'gray'
    }
  }
}

export const getAssetKindBadge = (input: {
  assetKind: TradeAsset['assetKind']
  id?: string
}): BadgeChip => ({
  id: input.id ?? 'assetKind',
  text: displayTradeAssetKind(input.assetKind),
  tone: getAssetKindTone(input.assetKind),
})

export function getTradeAssetTitle(asset: TradeAsset): string {
  switch (asset.assetKind) {
    case 'fiat': {
      return asset.currencyCode
    }
    case 'stock':
    case 'crypto': {
      return asset.name
    }
    case 'transport': {
      return asset.name
    }
    case 'event': {
      return asset.name
    }
    case 'other': {
      return 'Other Asset'
    }
    case 'nothing': {
      return 'Nothing'
    }
  }
}

export function getTradeAssetSubtitle(asset: TradeAsset): string {
  switch (asset.assetKind) {
    case 'fiat': {
      return formatMoney(asset.amount, asset.currencyCode)
    }
    case 'stock':
    case 'crypto': {
      return `${asset.symbol} • ${asset.amount}`
    }
    case 'transport': {
      return asset.description
    }
    case 'event': {
      return asset.description
    }
    case 'other': {
      return 'Custom asset'
    }
    case 'nothing': {
      return 'No asset'
    }
  }
}

export function toTradeAssetRef(asset: TradeAsset): TradeAssetRef | undefined {
  switch (asset.assetKind) {
    case 'fiat': {
      return {
        assetKind: 'fiat',
        linkedAccountID: asset.linkedAccountID,
        serviceTradeID: asset.serviceTradeID,
      }
    }
    case 'stock': {
      return {
        assetKind: 'stock',
        linkedAccountID: asset.linkedAccountID,
        serviceTradeID: asset.serviceTradeID,
      }
    }
    case 'crypto': {
      return {
        assetKind: 'crypto',
        linkedAccountID: asset.linkedAccountID,
        serviceTradeID: asset.serviceTradeID,
      }
    }
    case 'transport': {
      return {
        assetKind: 'transport',
        linkedAccountID: asset.linkedAccountID,
        serviceTradeID: asset.serviceTradeID,
      }
    }
    case 'event': {
      return {
        assetKind: 'event',
        linkedAccountID: asset.linkedAccountID,
        serviceTradeID: asset.serviceTradeID,
      }
    }
    case 'other': {
      return {
        assetKind: 'other',
      }
    }
    case 'nothing': {
      return {
        assetKind: 'nothing',
      }
    }
  }
}
