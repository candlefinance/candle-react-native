import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, RefreshControl, ScrollView } from 'react-native'
import type { TradeQuote, TradeQuoteLinkedAccountResult } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserSafeError } from '../../Errors/user-safe-error'
import { toUserSafeError } from '../../Errors/user-safe-error'
import type { BadgeChip } from '../Models/badge-chip'
import {
  getTradeQuoteBadges,
  getTradeQuoteLogo,
  getTradeQuoteTitle,
  getTradeQuoteValue,
} from '../Extensions/trade-quote'
import { getServiceLogo } from '../Extensions/service'
import type {
  TradeQuotesFlowNavigationProp,
  TradeQuotesFlowRouteProp,
  TradesStackNavigationProp,
} from '../Navigation/navigation-types'
import { styles } from '../styles'
import { ContentUnavailableState } from '../Views/content-unavailable-state'
import { DetailSection } from '../Views/detail-section'
import { ItemRow } from '../Views/item-row'
import { LoadingState } from '../Views/loading-state'

type TradeQuotesResponse = {
  linkedAccountResults: TradeQuoteLinkedAccountResult[]
  tradeQuotes: TradeQuote<any, any>[]
}
type ScreenState =
  | { kind: 'initial' }
  | { kind: 'loading' }
  | { kind: 'normal'; response: TradeQuotesResponse }

function getLinkedAccountResultBadges(result: TradeQuoteLinkedAccountResult): BadgeChip[] {
  switch (result.outcome) {
    case 'results_found': {
      return [{ id: 'outcome', text: `results: ${String(result.count)}`, tone: 'green' }]
    }
    case 'no_results': {
      return [{ id: 'outcome', text: result.reason, tone: 'yellow' }]
    }
    case 'session_expired': {
      return [{ id: 'outcome', text: 'session_expired', tone: 'red' }]
    }
    case 'proxy_unavailable': {
      return [{ id: 'outcome', text: 'proxy_unavailable', tone: 'orange' }]
    }
    case 'unexpected_error': {
      return [{ id: 'outcome', text: 'unexpected_error', tone: 'red' }]
    }
  }
}

export function TradeQuotesScreen() {
  const candle = useCandle()
  const stackNavigation = useNavigation<TradeQuotesFlowNavigationProp<'TradeQuotes'>>()
  const route = useRoute<TradeQuotesFlowRouteProp<'TradeQuotes'>>()
  const request = route.params.request

  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<UserSafeError | undefined>(undefined)
  const [state, setState] = useState<ScreenState>({ kind: 'initial' })

  const fetchTradeQuotes = useCallback(
    async ({ showLoading = true }: { showLoading?: boolean } = {}) => {
      if (showLoading) {
        setState({ kind: 'loading' })
      }
      setRefreshing(!showLoading)
      try {
        const result = await candle.getTradeQuotes(request)
        setState({ kind: 'normal', response: result })
      } catch (error_) {
        if (showLoading) {
          setState({ kind: 'initial' })
        }
        setError(toUserSafeError(error_))
      } finally {
        setRefreshing(false)
      }
    },
    [candle, request],
  )

  const executeTradeQuote = useCallback(
    (quote: TradeQuote<any, any>) => {
      candle.presentCandleTradeExecutionSheet({
        tradeQuote: quote,
        presentationBackground: 'blur',
        completion: (result) => {
          if (result.kind === 'success') {
            const { kind: _kind, ...trade } = result
            const rootNavigation =
              stackNavigation.getParent<TradesStackNavigationProp<'TradesHome'>>()
            rootNavigation.goBack()
            requestAnimationFrame(() => {
              rootNavigation.navigate('TradeDetails', {
                trade,
              })
            })
            return
          }
          const safeError = toUserSafeError(result.error)
          Alert.alert(safeError.title, safeError.message)
        },
      })
    },
    [candle, stackNavigation],
  )

  useEffect(() => {
    void fetchTradeQuotes()
  }, [fetchTradeQuotes])

  useEffect(() => {
    if (error === undefined) {
      return
    }
    Alert.alert(error.title, error.message, [
      {
        text: 'OK',
        style: 'cancel',
        onPress: () => {
          setError(undefined)
        },
      },
    ])
  }, [error])

  const response = state.kind === 'normal' ? state.response : undefined

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void fetchTradeQuotes({ showLoading: false })
            }}
          />
        }
      >
        <DetailSection title="Linked Account Results">
          {state.kind === 'initial' ? (
            <ContentUnavailableState
              title="Network Error"
              message="Check your connection and pull to refresh."
            />
          ) : state.kind === 'loading' ? (
            <LoadingState />
          ) : response?.linkedAccountResults.length === 0 ? (
            <ContentUnavailableState
              title="No Linked Accounts"
              message="Try changing your filters or linking more services."
            />
          ) : (
            (response?.linkedAccountResults.map((result, index) => (
              <ItemRow
                key={`${result.linkedAccountID}:${result.outcome}:${String(index)}`}
                title={result.linkedAccountID}
                subtitle={result.serviceUserID}
                logo={{ kind: 'uri', uri: getServiceLogo(result.service) }}
                badges={getLinkedAccountResultBadges(result)}
                isLast={index === response.linkedAccountResults.length - 1}
              />
            )) ?? null)
          )}
        </DetailSection>

        <DetailSection title="Trade Quotes">
          {state.kind === 'initial' ? (
            <ContentUnavailableState
              title="Network Error"
              message="Check your connection and pull to refresh."
            />
          ) : state.kind === 'loading' ? (
            <LoadingState />
          ) : response?.tradeQuotes.length === 0 ? (
            <ContentUnavailableState
              title="No Trade Quotes"
              message="Try changing your filters or linking more services."
            />
          ) : (
            (response?.tradeQuotes.map((quote, index) => (
              <ItemRow
                key={`${quote.context}-${String(index)}`}
                title={getTradeQuoteTitle(quote)}
                logo={{ kind: 'uri', uri: getTradeQuoteLogo(quote) }}
                badges={getTradeQuoteBadges(quote)}
                isLast={index === response.tradeQuotes.length - 1}
                value={getTradeQuoteValue(quote)}
                swipeActions={[
                  {
                    label: 'Execute',
                    variant: 'success',
                    onPress: () => {
                      executeTradeQuote(quote)
                    },
                  },
                ]}
                onPress={() => {
                  stackNavigation.push('TradeQuoteDetails', { quote })
                }}
              />
            )) ?? null)
          )}
        </DetailSection>
      </ScrollView>
    </SafeAreaView>
  )
}
