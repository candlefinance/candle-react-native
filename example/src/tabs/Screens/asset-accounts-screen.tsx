import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Alert, RefreshControl, View as RNView, ScrollView } from 'react-native'
import type { AssetAccount, LinkedAccount, LinkedAccountStatusRef } from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserSafeError } from '../../Errors/user-safe-error'
import { toUserSafeError } from '../../Errors/user-safe-error'
import { getAssetAccountBadges } from '../Extensions/asset-account'
import { formatMoney } from '../Extensions/format'
import { getServiceLogo } from '../Extensions/service'
import { displayTradeAssetKind } from '../Extensions/trade-asset'
import { EnumMenu } from '../Menus/enum-menu'
import { ASSET_ACCOUNT_KINDS } from '../Menus/filter-options'
import { LinkedAccountsMenu } from '../Menus/linked-accounts-menu'
import type { AccountsStackNavigationProp } from '../Navigation/navigation-types'
import { styles } from '../styles'
import { ContentUnavailableState } from '../Views/content-unavailable-state'
import { DetailSection } from '../Views/detail-section'
import { ItemRow } from '../Views/item-row'
import { LinkedAccountStatusRefsSection } from '../Views/linked-account-status-refs-section'
import { LoadingState } from '../Views/loading-state'

type AssetAccountsResponse = {
  linkedAccounts: LinkedAccountStatusRef[]
  assetAccounts: AssetAccount[]
}
type ScreenState =
  | { kind: 'initial' }
  | { kind: 'loading' }
  | { kind: 'normal'; response: AssetAccountsResponse }

export function AssetAccountsScreen({
  linkedAccounts,
  onAssetAccountsUpdated,
}: {
  linkedAccounts: LinkedAccount[]
  onAssetAccountsUpdated: (accounts: AssetAccount[]) => void
}) {
  const candle = useCandle()
  const stackNavigation = useNavigation<AccountsStackNavigationProp<'AssetAccounts'>>()
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<UserSafeError | undefined>(undefined)
  const [assetKind, setAssetKind] = useState<'fiat' | 'stock' | 'crypto' | 'transport' | undefined>(
    undefined,
  )
  const [selectedLinkedAccountIDs, setSelectedLinkedAccountIDs] = useState<string[]>([])
  const [showAssetKindModal, setShowAssetKindModal] = useState(false)
  const [showLinkedAccountModal, setShowLinkedAccountModal] = useState(false)
  const [state, setState] = useState<ScreenState>({ kind: 'initial' })

  const fetchAssetAccounts = useCallback(
    async ({ showLoading = true }: { showLoading?: boolean } = {}) => {
      if (showLoading) {
        setState({ kind: 'loading' })
      }
      setRefreshing(!showLoading)
      try {
        const result = await candle.getAssetAccounts({
          assetKind,
          linkedAccountIDs:
            selectedLinkedAccountIDs.length === 0 ? undefined : selectedLinkedAccountIDs.join(','),
        })
        onAssetAccountsUpdated(result.assetAccounts)
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
    [assetKind, candle, onAssetAccountsUpdated, selectedLinkedAccountIDs],
  )

  useEffect(() => {
    void fetchAssetAccounts()
  }, [fetchAssetAccounts])

  useEffect(() => {
    setSelectedLinkedAccountIDs((current) =>
      current.filter((id) => linkedAccounts.some((account) => account.linkedAccountID === id)),
    )
  }, [linkedAccounts])

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
              void fetchAssetAccounts({ showLoading: false })
            }}
          />
        }
      >
        <DetailSection title="Filters">
          <RNView style={styles.detailSectionContent}>
            <RNView style={styles.filterRow}>
              <EnumMenu
                title="Asset Kind"
                label={
                  assetKind === undefined
                    ? 'Asset Kind'
                    : `Asset Kind: ${displayTradeAssetKind(assetKind)}`
                }
                active={assetKind !== undefined}
                visible={showAssetKindModal}
                onOpen={() => {
                  setShowAssetKindModal(true)
                }}
                onClose={() => {
                  setShowAssetKindModal(false)
                }}
                selectedID={assetKind}
                options={ASSET_ACCOUNT_KINDS.map((kind) => ({
                  id: kind,
                  label: displayTradeAssetKind(kind),
                }))}
                clearOptionLabel="All"
                onClear={() => {
                  setAssetKind(undefined)
                }}
                onSelect={(id) => {
                  if (id === 'fiat' || id === 'stock' || id === 'crypto' || id === 'transport') {
                    setAssetKind(id)
                  }
                }}
              />
              <LinkedAccountsMenu
                linkedAccounts={linkedAccounts}
                selectedLinkedAccountIDs={selectedLinkedAccountIDs}
                visible={showLinkedAccountModal}
                onOpen={() => {
                  setShowLinkedAccountModal(true)
                }}
                onClose={() => {
                  setShowLinkedAccountModal(false)
                }}
                onChange={setSelectedLinkedAccountIDs}
              />
            </RNView>
          </RNView>
        </DetailSection>

        <LinkedAccountStatusRefsSection
          state={state.kind}
          linkedAccounts={response?.linkedAccounts}
          emptyMessage="Try changing your filters or linking more services."
        />

        <DetailSection title="Asset Accounts">
          {state.kind === 'initial' ? (
            <ContentUnavailableState
              title="Network Error"
              message="Check your connection and pull to refresh."
            />
          ) : state.kind === 'loading' ? (
            <LoadingState />
          ) : response?.assetAccounts.length === 0 ? (
            <ContentUnavailableState
              title="No Asset Accounts"
              message="Try changing your filters or linking more services."
            />
          ) : (
            (response?.assetAccounts.map((assetAccount, index) => (
              <ItemRow
                key={`${assetAccount.linkedAccountID}:${assetAccount.assetKind}:${assetAccount.serviceAccountID}`}
                title={assetAccount.nickname}
                logo={{ kind: 'uri', uri: getServiceLogo(assetAccount.service) }}
                badges={getAssetAccountBadges(assetAccount)}
                isLast={index === response.assetAccounts.length - 1}
                value={
                  assetAccount.assetKind === 'fiat' && assetAccount.balance !== undefined
                    ? formatMoney(assetAccount.balance, assetAccount.currencyCode)
                    : undefined
                }
                onPress={() => {
                  stackNavigation.push('AssetAccountDetails', {
                    assetAccount,
                  })
                }}
              />
            )) ?? null)
          )}
        </DetailSection>
      </ScrollView>
    </SafeAreaView>
  )
}
