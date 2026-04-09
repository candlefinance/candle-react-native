import type {
  CounterpartyQuoteRequest,
  TradeAssetQuoteRequest,
  TradeQuoteAssetKind,
} from 'react-native-candle'

export type RequestAssetKind = TradeQuoteAssetKind | 'other'

export type QuoteTemplateID =
  | 'fiatTransport'
  | 'nothingEventMerchant'
  | 'fiatOtherUser'
  | 'fiatCrypto'
  | 'cryptoFiat'
type QuoteTemplateIcon =
  | 'car-sport-outline'
  | 'restaurant-outline'
  | 'paper-plane-outline'
  | 'trending-up-outline'
  | 'trending-down-outline'

export type QuoteTemplate = {
  id: QuoteTemplateID
  title: string
  icon: QuoteTemplateIcon
  lost: TradeAssetQuoteRequest
  gained: TradeAssetQuoteRequest
  counterparty?: CounterpartyQuoteRequest
}

const defaultEventQuoteDate = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0, 0, 0)
}

const defaultEventQuoteRequest = (): TradeAssetQuoteRequest => ({
  assetKind: 'event',
  dateTime: defaultEventQuoteDate().toISOString(),
  partySize: 2,
})

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: 'fiatTransport',
    title: 'Book Ride',
    icon: 'car-sport-outline',
    lost: { assetKind: 'fiat' },
    gained: { assetKind: 'transport' },
  },
  {
    id: 'nothingEventMerchant',
    title: 'Book Restaurant',
    icon: 'restaurant-outline',
    lost: { assetKind: 'nothing' },
    gained: defaultEventQuoteRequest(),
    counterparty: { kind: 'merchant' },
  },
  {
    id: 'fiatOtherUser',
    title: 'Send Money',
    icon: 'paper-plane-outline',
    lost: { assetKind: 'fiat' },
    gained: { assetKind: 'other' },
    counterparty: { kind: 'user' },
  },
  {
    id: 'fiatCrypto',
    title: 'Buy Crypto',
    icon: 'trending-up-outline',
    lost: { assetKind: 'fiat' },
    gained: { assetKind: 'crypto' },
  },
  {
    id: 'cryptoFiat',
    title: 'Sell Crypto',
    icon: 'trending-down-outline',
    lost: { assetKind: 'crypto' },
    gained: { assetKind: 'fiat' },
  },
]

export function defaultAssetQuoteRequest(assetKind: RequestAssetKind): TradeAssetQuoteRequest {
  switch (assetKind) {
    case 'fiat': {
      return { assetKind: 'fiat' }
    }
    case 'stock': {
      return { assetKind: 'stock' }
    }
    case 'crypto': {
      return { assetKind: 'crypto' }
    }
    case 'transport': {
      return { assetKind: 'transport' }
    }
    case 'event': {
      return defaultEventQuoteRequest()
    }
    case 'other': {
      return { assetKind: 'other' }
    }
    case 'nothing': {
      return { assetKind: 'nothing' }
    }
  }
}

export function defaultCounterpartyQuoteRequest(
  kind: 'merchant' | 'user' | 'service',
): CounterpartyQuoteRequest {
  switch (kind) {
    case 'merchant': {
      return { kind: 'merchant' }
    }
    case 'user': {
      return { kind: 'user' }
    }
    case 'service': {
      return { kind: 'service' }
    }
  }
}
