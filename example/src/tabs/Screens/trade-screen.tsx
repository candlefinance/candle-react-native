import { useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, RefreshControl, Text as RNText, ScrollView } from 'react-native'
import type { Trade, TradeAssetKind } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toUserSafeError } from '../../Errors/user-safe-error'
import { formatDateTime } from '../Extensions/format'
import {
  displayTradeState,
  getTradeBadges,
  getTradeLogo,
  getTradeTitle,
  toTradeRef,
} from '../Extensions/trade'
import type { TradesStackRouteProp } from '../Navigation/navigation-types'
import { styles } from '../styles'
import { CounterpartyGroup } from '../Views/counterparty-group'
import { DetailSection } from '../Views/detail-section'
import { InfoHeader } from '../Views/info-header'
import { InfoRow } from '../Views/info-row'
import { TradeAssetGroup } from '../Views/trade-asset-group'

export function TradeScreen() {
  const candle = useCandle()
  const route = useRoute<TradesStackRouteProp<'TradeDetails'>>()
  const [trade, setTrade] = useState<Trade<TradeAssetKind, TradeAssetKind>>(route.params.trade)
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    setTrade(route.params.trade)
  }, [route.params])

  const refresh = useCallback(async () => {
    const ref = toTradeRef(trade)
    if (ref === undefined) {
      return
    }

    setLoading(true)
    try {
      const latestTrade = await candle.getTrade(ref)
      setTrade(latestTrade)
    } catch (error) {
      const safeError = toUserSafeError(error)
      Alert.alert(safeError.title, safeError.message)
    } finally {
      setLoading(false)
    }
  }, [candle, trade])

  const cancelTrade = useCallback(async () => {
    const ref = toTradeRef(trade)
    if (ref === undefined) {
      return
    }

    setCancelling(true)
    try {
      const cancelledTrade = await candle.cancelTrade(ref)
      setTrade(cancelledTrade)
    } catch (error) {
      const safeError = toUserSafeError(error)
      Alert.alert(safeError.title, safeError.message)
    } finally {
      setCancelling(false)
    }
  }, [candle, trade])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              void refresh()
            }}
          />
        }
      >
        <DetailSection title="Overview">
          <InfoHeader
            logo={{ kind: 'uri', uri: getTradeLogo(trade) }}
            title={getTradeTitle(trade)}
            badges={getTradeBadges(trade)}
          />
        </DetailSection>

        <DetailSection title="Details">
          <InfoRow title="Date/Time" value={formatDateTime(trade.dateTime)} />
          <InfoRow title="State" value={displayTradeState(trade.state)} />
        </DetailSection>

        <TradeAssetGroup title="Lost Asset" asset={trade.lost} />
        <TradeAssetGroup title="Gained Asset" asset={trade.gained} />
        <CounterpartyGroup counterparty={trade.counterparty} />
        {trade.state !== 'inProgress' || toTradeRef(trade) === undefined ? null : (
          <DetailSection title="Actions">
            <Pressable
              disabled={cancelling}
              onPress={() => {
                void cancelTrade()
              }}
              style={[
                styles.secondaryButton,
                styles.destructiveButton,
                cancelling ? styles.primaryButtonDisabled : undefined,
              ]}
            >
              <RNText style={[styles.secondaryButtonText, styles.destructiveButtonText]}>
                {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
              </RNText>
            </Pressable>
          </DetailSection>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
