import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, RefreshControl, ScrollView } from 'react-native'
import type { LinkedAccountStatusRef, TradeQuote } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserSafeError } from '../../Errors/user-safe-error'
import { toUserSafeError } from '../../Errors/user-safe-error'
import {
  getTradeQuoteBadges,
  getTradeQuoteLogo,
  getTradeQuoteTitle,
  getTradeQuoteValue,
} from '../Extensions/trade-quote'
import type {
  TradeQuotesFlowNavigationProp,
  TradeQuotesFlowRouteProp,
  TradesStackNavigationProp,
} from '../Navigation/navigation-types'
import { styles } from '../styles'
import { ContentUnavailableState } from '../Views/content-unavailable-state'
import { DetailSection } from '../Views/detail-section'
import { ItemRow } from '../Views/item-row'
import { LinkedAccountStatusRefsSection } from '../Views/linked-account-status-refs-section'
import { LoadingState } from '../Views/loading-state'

type TradeQuotesResponse = {
  linkedAccounts: LinkedAccountStatusRef[]
  tradeQuotes: TradeQuote<any, any>[]
}
type ScreenState =
  | { kind: 'initial' }
  | { kind: 'loading' }
  | { kind: 'normal'; response: TradeQuotesResponse }

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
        <LinkedAccountStatusRefsSection
          state={state.kind}
          linkedAccounts={response?.linkedAccounts}
          emptyMessage="Try changing your filters or linking more services."
        />

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
