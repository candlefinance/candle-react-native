import type { TradeAssetKind } from 'react-native-candle'

export const TRADE_ASSET_KINDS: TradeAssetKind[] = [
  'fiat',
  'stock',
  'crypto',
  'transport',
  'event',
  'other',
  'nothing',
]

export const ASSET_ACCOUNT_KINDS: ('fiat' | 'stock' | 'crypto' | 'transport')[] = [
  'fiat',
  'stock',
  'crypto',
  'transport',
]

export const COUNTERPARTY_KINDS: ('merchant' | 'user' | 'service')[] = [
  'merchant',
  'user',
  'service',
]
