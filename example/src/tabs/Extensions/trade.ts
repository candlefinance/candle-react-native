import type { Trade, TradeAssetKind, TradeAssetRef, TradeState } from 'react-native-candle'
import type { BadgeChip } from '../Models/badge-chip'
import { getCounterpartyImage, getCounterpartyTitle } from './counterparty'
import { formatDate, formatMoney } from './format'
import { getServiceLogo } from './service'
import { getAssetKindBadge, toTradeAssetRef } from './trade-asset'

export const displayTradeState = (state: TradeState): string => {
  switch (state) {
    case 'failure': {
      return 'Failure'
    }
    case 'inProgress': {
      return 'In Progress'
    }
    case 'success': {
      return 'Success'
    }
  }
}

export function getTradeBadges(trade: Trade<TradeAssetKind, TradeAssetKind>): BadgeChip[] {
  return [
    getAssetKindBadge({ id: 'lostAssetKind', assetKind: trade.lost.assetKind }),
    getAssetKindBadge({ id: 'gainedAssetKind', assetKind: trade.gained.assetKind }),
  ]
}

export function getTradeTitle(trade: Trade<TradeAssetKind, TradeAssetKind>): string {
  if (trade.gained.assetKind === 'stock' || trade.gained.assetKind === 'crypto') {
    return trade.gained.name
  }
  if (trade.gained.assetKind === 'transport') {
    return trade.gained.name
  }
  if (trade.gained.assetKind === 'event') {
    return trade.gained.name
  }
  if (trade.lost.assetKind === 'stock' || trade.lost.assetKind === 'crypto') {
    return trade.lost.name
  }
  if (trade.lost.assetKind === 'transport') {
    return trade.lost.name
  }
  if (trade.lost.assetKind === 'event') {
    return trade.lost.name
  }
  return getCounterpartyTitle(trade.counterparty)
}

export function getTradeValue(trade: Trade<TradeAssetKind, TradeAssetKind>): string | undefined {
  if (trade.gained.assetKind === 'fiat') {
    return formatMoney(trade.gained.amount, trade.gained.currencyCode)
  }
  if (trade.lost.assetKind === 'fiat') {
    return formatMoney(-trade.lost.amount, trade.lost.currencyCode)
  }
  return undefined
}

export function getTradeLogo(trade: Trade<TradeAssetKind, TradeAssetKind>): string {
  if (trade.gained.assetKind === 'fiat') {
    return getServiceLogo(trade.gained.service)
  }
  if (trade.gained.assetKind === 'stock' || trade.gained.assetKind === 'crypto') {
    return trade.gained.logoURL
  }
  if (trade.gained.assetKind === 'transport') {
    return trade.gained.imageURL
  }
  if (trade.gained.assetKind === 'event') {
    return trade.gained.imageURL
  }
  if (trade.lost.assetKind === 'fiat') {
    return getServiceLogo(trade.lost.service)
  }
  if (trade.lost.assetKind === 'stock' || trade.lost.assetKind === 'crypto') {
    return trade.lost.logoURL
  }
  if (trade.lost.assetKind === 'transport') {
    return trade.lost.imageURL
  }
  if (trade.lost.assetKind === 'event') {
    return trade.lost.imageURL
  }
  return getCounterpartyImage(trade.counterparty)
}

export function toTradeRef(
  trade: Trade<TradeAssetKind, TradeAssetKind>,
): { gained: TradeAssetRef; lost: TradeAssetRef } | undefined {
  const gained = toTradeAssetRef(trade.gained)
  const lost = toTradeAssetRef(trade.lost)
  if (gained === undefined || lost === undefined) {
    return undefined
  }
  return { gained, lost }
}

export function groupTradesByDate(
  trades: Trade<TradeAssetKind, TradeAssetKind>[],
): { key: string; title: string; trades: Trade<TradeAssetKind, TradeAssetKind>[] }[] {
  const grouped = new Map<string, Trade<TradeAssetKind, TradeAssetKind>[]>()

  for (const trade of trades) {
    const date = new Date(trade.dateTime)
    if (Number.isNaN(date.valueOf())) {
      const unknownGroup = grouped.get('unknown') ?? []
      unknownGroup.push(trade)
      grouped.set('unknown', unknownGroup)
      continue
    }

    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const existing = grouped.get(key) ?? []
    existing.push(trade)
    grouped.set(key, existing)
  }

  return [...grouped.entries()]
    .map(([key, value]) => {
      if (key === 'unknown') {
        return { key, title: 'Unknown', trades: value }
      }
      const day = new Date(value[0]?.dateTime ?? Date.now())
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      const title =
        day.toDateString() === today.toDateString()
          ? 'Today'
          : day.toDateString() === yesterday.toDateString()
            ? 'Yesterday'
            : formatDate(day)

      return { key, title, trades: value }
    })
    .sort((a, b) => {
      if (a.key === 'unknown') {
        return 1
      }
      if (b.key === 'unknown') {
        return -1
      }
      return (
        new Date(b.trades[0]?.dateTime ?? Date.now()).valueOf() -
        new Date(a.trades[0]?.dateTime ?? Date.now()).valueOf()
      )
    })
}
