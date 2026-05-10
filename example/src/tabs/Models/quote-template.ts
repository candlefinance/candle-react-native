import type {
  CounterpartyQuoteRequest,
  TradeAssetQuoteRequest,
  TradeQuoteAssetKind,
} from 'react-native-candle'

export type RequestAssetKind = TradeQuoteAssetKind | 'other'

export type QuoteTemplateID =
  | 'fiatTransport'
  | 'nothingEventMerchant'
  | 'nothingMessageThreadUser'
  | 'nothingFriendRequestUser'
  | 'friendRequestNothingUser'
  | 'fiatOtherUser'
  | 'fiatCrypto'
  | 'cryptoFiat'
type QuoteTemplateIcon =
  | 'car-sport-outline'
  | 'chatbubble-ellipses-outline'
  | 'person-add-outline'
  | 'person-remove-outline'
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

const defaultEventQuoteRequest = (): TradeAssetQuoteRequest => {
  const now = new Date()

  return {
    assetKind: 'event',
    dateTime: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      19,
      0,
      0,
      0,
    ).toISOString(),
    partySize: 2,
  }
}

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
    id: 'nothingMessageThreadUser',
    title: 'Send Message',
    icon: 'chatbubble-ellipses-outline',
    lost: { assetKind: 'nothing' },
    gained: { assetKind: 'message_thread', text: '' },
    counterparty: { kind: 'user' },
  },
  {
    id: 'nothingFriendRequestUser',
    title: 'Add Friend',
    icon: 'person-add-outline',
    lost: { assetKind: 'nothing' },
    gained: { assetKind: 'friend_request', action: 'send' },
    counterparty: { kind: 'user' },
  },
  {
    id: 'friendRequestNothingUser',
    title: 'Withdraw Friend Request',
    icon: 'person-remove-outline',
    lost: { assetKind: 'friend_request', action: 'withdraw' },
    gained: { assetKind: 'nothing' },
    counterparty: { kind: 'user' },
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
    case 'message_thread': {
      return { assetKind: 'message_thread', text: '' }
    }
    case 'friend_request': {
      return { assetKind: 'friend_request', action: 'send' }
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
