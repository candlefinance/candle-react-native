import type { TradeAsset, TradeQuote } from 'react-native-candle'
import type { BadgeChip } from '../Models/badge-chip'
import { getCounterpartyImage, getCounterpartyTitle } from './counterparty'
import { formatMoney } from './format'
import { getServiceLogo } from './service'
import { getAssetKindBadge } from './trade-asset'

export function getTradeQuoteBadges(quote: TradeQuote<any, any>): BadgeChip[] {
  return [
    getAssetKindBadge({ id: 'lostAssetKind', assetKind: quote.lost.assetKind }),
    getAssetKindBadge({ id: 'gainedAssetKind', assetKind: quote.gained.assetKind }),
  ]
}

export function getTradeQuoteTitle(quote: TradeQuote<any, any>): string {
  const gained: TradeAsset = quote.gained
  const lost: TradeAsset = quote.lost
  if (gained.assetKind === 'stock' || gained.assetKind === 'crypto') {
    return gained.name
  }
  if (gained.assetKind === 'transport') {
    return gained.name
  }
  if (gained.assetKind === 'event') {
    return gained.name
  }
  if (lost.assetKind === 'stock' || lost.assetKind === 'crypto') {
    return lost.name
  }
  if (lost.assetKind === 'transport') {
    return lost.name
  }
  if (lost.assetKind === 'event') {
    return lost.name
  }
  return getCounterpartyTitle(quote.counterparty)
}

export function getTradeQuoteValue(quote: TradeQuote<any, any>): string | undefined {
  const gained: TradeAsset = quote.gained
  const lost: TradeAsset = quote.lost
  if (gained.assetKind === 'fiat') {
    return formatMoney(gained.amount, gained.currencyCode)
  }
  if (lost.assetKind === 'fiat') {
    return formatMoney(-lost.amount, lost.currencyCode)
  }
  return undefined
}

export function getTradeQuoteLogo(quote: TradeQuote<any, any>): string {
  const gained: TradeAsset = quote.gained
  const lost: TradeAsset = quote.lost
  if (gained.assetKind === 'fiat') {
    return getServiceLogo(gained.service)
  }
  if (gained.assetKind === 'stock' || gained.assetKind === 'crypto') {
    return gained.logoURL
  }
  if (gained.assetKind === 'transport') {
    return gained.imageURL
  }
  if (gained.assetKind === 'event') {
    return gained.imageURL
  }
  if (lost.assetKind === 'fiat') {
    return getServiceLogo(lost.service)
  }
  if (lost.assetKind === 'stock' || lost.assetKind === 'crypto') {
    return lost.logoURL
  }
  if (lost.assetKind === 'transport') {
    return lost.imageURL
  }
  if (lost.assetKind === 'event') {
    return lost.imageURL
  }
  return getCounterpartyImage(quote.counterparty)
}
