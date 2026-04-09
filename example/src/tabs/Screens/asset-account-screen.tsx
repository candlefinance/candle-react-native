import { useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, RefreshControl, ScrollView } from 'react-native'
import type { AssetAccount } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toUserSafeError } from '../../Errors/user-safe-error'
import {
  displayACHAccountKind,
  displayAccountKind,
  getAssetAccountBadges,
} from '../Extensions/asset-account'
import { formatMoney } from '../Extensions/format'
import { getServiceLogo } from '../Extensions/service'
import type { AccountsStackRouteProp } from '../Navigation/navigation-types'
import { styles } from '../styles'
import { DetailSection } from '../Views/detail-section'
import { InfoHeader } from '../Views/info-header'
import { InfoRow } from '../Views/info-row'

export function AssetAccountScreen() {
  const candle = useCandle()
  const route = useRoute<AccountsStackRouteProp<'AssetAccountDetails'>>()
  const [assetAccount, setAssetAccount] = useState<AssetAccount>(route.params.assetAccount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAssetAccount(route.params.assetAccount)
  }, [route.params])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const latest = await candle.getAssetAccount({
        linkedAccountID: assetAccount.linkedAccountID,
        assetKind: assetAccount.assetKind,
        serviceAccountID: assetAccount.serviceAccountID,
      })
      setAssetAccount(latest)
    } catch (error) {
      const safeError = toUserSafeError(error)
      Alert.alert(safeError.title, safeError.message)
    } finally {
      setLoading(false)
    }
  }, [assetAccount.assetKind, assetAccount.linkedAccountID, assetAccount.serviceAccountID, candle])

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
            logo={{ kind: 'uri', uri: getServiceLogo(assetAccount.service) }}
            title={assetAccount.nickname}
            badges={getAssetAccountBadges(assetAccount)}
          />
        </DetailSection>

        <DetailSection title="Details">
          {assetAccount.assetKind === 'stock' || assetAccount.assetKind === 'transport' ? (
            <InfoRow title="Nickname" value={assetAccount.nickname} />
          ) : null}
          <InfoRow title="Account Kind" value={displayAccountKind(assetAccount.accountKind)} />
          {assetAccount.assetKind === 'fiat' ? (
            <>
              {assetAccount.balance === undefined ? (
                <InfoRow title="Currency Code" value={assetAccount.currencyCode} />
              ) : (
                <InfoRow
                  title="Balance"
                  value={formatMoney(assetAccount.balance, assetAccount.currencyCode)}
                />
              )}
            </>
          ) : null}
        </DetailSection>

        {assetAccount.assetKind === 'fiat' && assetAccount.ach !== undefined ? (
          <DetailSection title="ACH">
            <InfoRow
              title="Account Kind"
              value={displayACHAccountKind(assetAccount.ach.accountKind)}
            />
            <InfoRow title="Account Number" value={assetAccount.ach.accountNumber} />
            <InfoRow title="Routing Number" value={assetAccount.ach.routingNumber} />
          </DetailSection>
        ) : null}

        {assetAccount.assetKind === 'fiat' && assetAccount.wire !== undefined ? (
          <DetailSection title="Wire">
            <InfoRow title="Account Number" value={assetAccount.wire.accountNumber} />
            <InfoRow title="Routing Number" value={assetAccount.wire.routingNumber} />
          </DetailSection>
        ) : null}

        <DetailSection title="Metadata">
          <InfoRow title="Service Account ID" value={assetAccount.serviceAccountID} />
          <InfoRow title="Linked Account ID" value={assetAccount.linkedAccountID} />
        </DetailSection>
      </ScrollView>
    </SafeAreaView>
  )
}
