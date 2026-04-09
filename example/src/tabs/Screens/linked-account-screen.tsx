import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Alert, Pressable, RefreshControl, Text as RNText, ScrollView } from 'react-native'
import type { LinkedAccount } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toUserSafeError } from '../../Errors/user-safe-error'
import { formatDateTime } from '../Extensions/format'
import { getLinkedAccountBadges, getLinkedAccountTitle } from '../Extensions/linked-account'
import { getServiceLogo } from '../Extensions/service'
import type {
  ServicesStackNavigationProp,
  ServicesStackRouteProp,
} from '../Navigation/navigation-types'
import { styles } from '../styles'
import { DetailSection } from '../Views/detail-section'
import { InfoHeader } from '../Views/info-header'
import { InfoRow } from '../Views/info-row'

export function LinkedAccountScreen({
  onLinkedAccountsUpdated,
  onAssetAccountsCleared,
}: {
  onLinkedAccountsUpdated: (accounts: LinkedAccount[]) => void
  onAssetAccountsCleared: () => void
}) {
  const candle = useCandle()
  const stackNavigation = useNavigation<ServicesStackNavigationProp<'LinkedAccountDetails'>>()
  const route = useRoute<ServicesStackRouteProp<'LinkedAccountDetails'>>()
  const [account, setAccount] = useState<LinkedAccount>(route.params.account)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAccount(route.params.account)
  }, [route.params])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const latest = await candle.getLinkedAccount({
        linkedAccountID: account.linkedAccountID,
      })
      setAccount(latest)
    } catch (error) {
      const safeError = toUserSafeError(error)
      Alert.alert(safeError.title, safeError.message)
    } finally {
      setLoading(false)
    }
  }, [account.linkedAccountID, candle])

  const refreshLinkedAccounts = useCallback(async () => {
    const accounts = await candle.getLinkedAccounts()
    onLinkedAccountsUpdated(accounts)
  }, [candle, onLinkedAccountsUpdated])

  const relink = useCallback(() => {
    candle.presentCandleLinkSheet({
      services: ['cash_app', 'lyft', 'opentable', 'robinhood', 'sandbox', 'uber', 'venmo'],
      customerName: 'Acme Inc',
      presentationBackground: 'blur',
      presentationStyle: 'fullScreen',
      onSuccess: () => {
        void refresh()
        void refreshLinkedAccounts()
      },
    })
  }, [candle, refresh, refreshLinkedAccounts])

  const unlink = useCallback(async () => {
    setLoading(true)
    try {
      await candle.unlinkAccount({ linkedAccountID: account.linkedAccountID })
      onAssetAccountsCleared()
      await refreshLinkedAccounts()
      stackNavigation.goBack()
    } catch (error) {
      const safeError = toUserSafeError(error)
      Alert.alert(safeError.title, safeError.message)
    } finally {
      setLoading(false)
    }
  }, [account, candle, onAssetAccountsCleared, refreshLinkedAccounts, stackNavigation])

  useLayoutEffect(() => {
    stackNavigation.setOptions(
      account.details.state === 'inactive'
        ? {
            headerRight: () => (
              <Pressable onPress={relink} style={styles.headerTextButton}>
                <RNText style={styles.headerTextButtonLabel}>Re-Link</RNText>
              </Pressable>
            ),
          }
        : {},
    )
  }, [account, stackNavigation, relink])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
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
            logo={{ kind: 'uri', uri: getServiceLogo(account.service) }}
            title={getLinkedAccountTitle(account)}
            badges={getLinkedAccountBadges(account)}
          />
        </DetailSection>

        {account.details.state === 'active' ? (
          <DetailSection title="Details">
            {account.details.username === undefined ? null : (
              <InfoRow title="Username" value={account.details.username} />
            )}
            {account.details.emailAddress === undefined ? null : (
              <InfoRow title="Email Address" value={account.details.emailAddress} />
            )}
            {account.details.accountOpened === undefined ? null : (
              <InfoRow
                title="Account Opened"
                value={formatDateTime(account.details.accountOpened)}
              />
            )}
          </DetailSection>
        ) : null}

        <DetailSection title="Metadata">
          <InfoRow title="Service User ID" value={account.serviceUserID} />
          <InfoRow title="Linked Account ID" value={account.linkedAccountID} />
        </DetailSection>
      </ScrollView>
      <Pressable
        onPress={() => {
          Alert.alert(
            'Are You Sure?',
            'You will no longer be able to view asset accounts or trades, retrieve trade quotes, or execute trades using this account.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Unlink Account',
                style: 'destructive',
                onPress: () => {
                  void unlink()
                },
              },
            ],
          )
        }}
        style={[styles.secondaryButton, styles.destructiveButton]}
      >
        <RNText style={[styles.secondaryButtonText, styles.destructiveButtonText]}>
          Unlink Account
        </RNText>
      </Pressable>
    </SafeAreaView>
  )
}
