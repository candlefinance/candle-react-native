import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useLayoutEffect } from 'react'
import { Alert, Pressable, Text as RNText, ScrollView } from 'react-native'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toUserSafeError } from '../../Errors/user-safe-error'
import { formatDateTime } from '../Extensions/format'
import {
  getTradeQuoteBadges,
  getTradeQuoteLogo,
  getTradeQuoteTitle,
} from '../Extensions/trade-quote'
import type {
  TradeQuotesFlowNavigationProp,
  TradeQuotesFlowRouteProp,
  TradesStackNavigationProp,
} from '../Navigation/navigation-types'
import { styles } from '../styles'
import { CounterpartyGroup } from '../Views/counterparty-group'
import { DetailSection } from '../Views/detail-section'
import { InfoHeader } from '../Views/info-header'
import { InfoRow } from '../Views/info-row'
import { TradeAssetGroup } from '../Views/trade-asset-group'

export function TradeQuoteScreen() {
  const candle = useCandle()
  const stackNavigation = useNavigation<TradeQuotesFlowNavigationProp<'TradeQuoteDetails'>>()
  const route = useRoute<TradeQuotesFlowRouteProp<'TradeQuoteDetails'>>()
  const quote = route.params.quote

  const executeTrade = useCallback(() => {
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
  }, [candle, quote, stackNavigation])

  useLayoutEffect(() => {
    stackNavigation.setOptions({
      headerRight: () => (
        <Pressable onPress={executeTrade} style={styles.headerTextButton}>
          <RNText style={styles.headerTextButtonLabel}>Request</RNText>
        </Pressable>
      ),
    })
  }, [executeTrade, stackNavigation])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <DetailSection title="Overview">
          <InfoHeader
            logo={{ kind: 'uri', uri: getTradeQuoteLogo(quote) }}
            title={getTradeQuoteTitle(quote)}
            badges={getTradeQuoteBadges(quote)}
          />
        </DetailSection>

        <DetailSection title="Details">
          <InfoRow title="Expiration Date/Time" value={formatDateTime(quote.expirationDateTime)} />
        </DetailSection>

        <TradeAssetGroup title="Lost Asset" asset={quote.lost} />
        <TradeAssetGroup title="Gained Asset" asset={quote.gained} />
        <CounterpartyGroup counterparty={quote.counterparty} />
      </ScrollView>
    </SafeAreaView>
  )
}
