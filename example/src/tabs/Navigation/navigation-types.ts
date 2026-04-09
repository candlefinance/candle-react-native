import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type {
  AssetAccount,
  LinkedAccount,
  Trade,
  TradeAssetKind,
  TradeQuote,
  TradeQuotesRequest,
} from 'react-native-candle'
import type { QuoteTemplateID } from '../Models/quote-template'

export type ServicesStackParamList = {
  LinkedAccounts: undefined
  LinkedAccountDetails: { account: LinkedAccount }
}

export type ServicesStackNavigationProp<T extends keyof ServicesStackParamList> =
  NativeStackNavigationProp<ServicesStackParamList, T>

export type ServicesStackRouteProp<T extends keyof ServicesStackParamList> = RouteProp<
  ServicesStackParamList,
  T
>

export type AccountsStackParamList = {
  AssetAccounts: undefined
  AssetAccountDetails: { assetAccount: AssetAccount }
}

export type AccountsStackNavigationProp<T extends keyof AccountsStackParamList> =
  NativeStackNavigationProp<AccountsStackParamList, T>

export type AccountsStackRouteProp<T extends keyof AccountsStackParamList> = RouteProp<
  AccountsStackParamList,
  T
>

export type CoordinateEditorTarget =
  | 'lostOrigin'
  | 'lostDestination'
  | 'gainedOrigin'
  | 'gainedDestination'

export type CoordinateSelection = {
  latitude: number
  longitude: number
  revision: number
  target: CoordinateEditorTarget
}

export type TradeQuotesFlowParamList = {
  TradeQuoteRequest: { templateID: QuoteTemplateID; coordinateSelection?: CoordinateSelection }
  TradeQuotes: { request: TradeQuotesRequest<any, any> }
  TradeQuoteDetails: { quote: TradeQuote<any, any> }
  CoordinateDetails: {
    requestRouteKey: string
    target: CoordinateEditorTarget
    latitude?: number
    longitude?: number
  }
}

export type TradeQuotesFlowNavigationProp<T extends keyof TradeQuotesFlowParamList> =
  NativeStackNavigationProp<TradeQuotesFlowParamList, T>

export type TradeQuotesFlowRouteProp<T extends keyof TradeQuotesFlowParamList> = RouteProp<
  TradeQuotesFlowParamList,
  T
>

export type TradesStackParamList = {
  TradesHome: undefined
  TradeDetails: { trade: Trade<TradeAssetKind, TradeAssetKind> }
  TradeQuotesFlow: { templateID: QuoteTemplateID }
}

export type TradesStackNavigationProp<T extends keyof TradesStackParamList> =
  NativeStackNavigationProp<TradesStackParamList, T>

export type TradesStackRouteProp<T extends keyof TradesStackParamList> = RouteProp<
  TradesStackParamList,
  T
>
