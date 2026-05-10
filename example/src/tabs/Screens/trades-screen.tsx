import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import {
  Alert,
  RefreshControl,
  TextInput as RNTextInput,
  View as RNView,
  ScrollView,
} from 'react-native'
import type {
  LinkedAccount,
  LinkedAccountStatusRef,
  Trade,
  TradeAssetKind,
} from 'react-native-candle'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { UserSafeError } from '../../Errors/user-safe-error'
import { toUserSafeError } from '../../Errors/user-safe-error'
import { displayCounterpartyKind, getCounterpartyTitle } from '../Extensions/counterparty'
import {
  displayTradeState,
  getTradeBadges,
  getTradeLogo,
  getTradeSubtitle,
  getTradeTitle,
  getTradeValue,
  groupTradesByDate,
} from '../Extensions/trade'
import { displayTradeAssetKind, getTradeAssetTitle } from '../Extensions/trade-asset'
import { DATE_TIME_SPANS } from '../Menus/date-time-spans'
import { EnumMenu } from '../Menus/enum-menu'
import { COUNTERPARTY_KINDS, TRADE_ASSET_KINDS } from '../Menus/filter-options'
import { HeaderDropdownMenu } from '../Menus/header-dropdown-menu'
import { LinkedAccountsMenu } from '../Menus/linked-accounts-menu'
import { QUOTE_TEMPLATES } from '../Models/quote-template'
import type { TradesStackNavigationProp } from '../Navigation/navigation-types'
import { styles } from '../styles'
import { ContentUnavailableState } from '../Views/content-unavailable-state'
import { DetailSection } from '../Views/detail-section'
import { ItemRow } from '../Views/item-row'
import { LinkedAccountStatusRefsSection } from '../Views/linked-account-status-refs-section'
import { LoadingState } from '../Views/loading-state'

type TradesResponse = {
  linkedAccounts: LinkedAccountStatusRef[]
  trades: Trade<TradeAssetKind, TradeAssetKind>[]
}
type ScreenState =
  | { kind: 'initial' }
  | { kind: 'loading' }
  | { kind: 'normal'; response: TradesResponse }

export function TradesScreen({
  linkedAccounts,
}: {
  linkedAccounts: LinkedAccount[]
  assetAccounts: any[]
}) {
  const candle = useCandle()
  const stackNavigation = useNavigation<TradesStackNavigationProp<'TradesHome'>>()
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<UserSafeError | undefined>(undefined)
  const [state, setState] = useState<ScreenState>({ kind: 'initial' })
  const [searchText, setSearchText] = useState('')
  const [dateTimeSpan, setDateTimeSpan] = useState<string | undefined>('P1M')
  const [lostAssetKind, setLostAssetKind] = useState<TradeAssetKind | undefined>(undefined)
  const [gainedAssetKind, setGainedAssetKind] = useState<TradeAssetKind | undefined>(undefined)
  const [counterpartyKind, setCounterpartyKind] = useState<
    'merchant' | 'user' | 'service' | undefined
  >(undefined)
  const [selectedLinkedAccountIDs, setSelectedLinkedAccountIDs] = useState<string[]>([])
  const [showDateTimeSpanModal, setShowDateTimeSpanModal] = useState(false)
  const [showLostAssetKindModal, setShowLostAssetKindModal] = useState(false)
  const [showGainedAssetKindModal, setShowGainedAssetKindModal] = useState(false)
  const [showCounterpartyKindModal, setShowCounterpartyKindModal] = useState(false)
  const [showLinkedAccountModal, setShowLinkedAccountModal] = useState(false)
  const quoteTemplateActions = useMemo(
    () =>
      QUOTE_TEMPLATES.map((template) => ({
        id: template.id,
        label: template.title,
        icon: template.icon,
        onPress: () => {
          stackNavigation.navigate('TradeQuotesFlow', { templateID: template.id })
        },
      })),
    [stackNavigation],
  )

  const fetchTrades = useCallback(
    async ({ showLoading = true }: { showLoading?: boolean } = {}) => {
      if (showLoading) {
        setState({ kind: 'loading' })
      }
      setRefreshing(!showLoading)
      try {
        const result = await candle.getTrades({
          dateTimeSpan,
          lostAssetKind,
          gainedAssetKind,
          counterpartyKind,
          linkedAccountIDs:
            selectedLinkedAccountIDs.length === 0 ? undefined : selectedLinkedAccountIDs.join(','),
        })
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
    [
      candle,
      counterpartyKind,
      dateTimeSpan,
      gainedAssetKind,
      lostAssetKind,
      selectedLinkedAccountIDs,
    ],
  )

  useLayoutEffect(() => {
    stackNavigation.setOptions({
      headerRight: () => (
        <HeaderDropdownMenu
          accessibilityLabel="Create trade"
          actions={quoteTemplateActions}
          icon="add-circle"
        />
      ),
    })
  }, [quoteTemplateActions, stackNavigation])

  useEffect(() => {
    void fetchTrades()
  }, [fetchTrades])

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

  const filteredTrades = useMemo(() => {
    if (searchText.length === 0) {
      return response?.trades ?? []
    }

    const query = searchText.trim().toLowerCase()
    return (response?.trades ?? []).filter((trade) =>
      [
        getTradeTitle(trade),
        getTradeSubtitle(trade) ?? '',
        getCounterpartyTitle(trade.counterparty),
        getTradeAssetTitle(trade.gained),
        getTradeAssetTitle(trade.lost),
        displayTradeState(trade.state),
        ...(trade.gained.assetKind === 'message_thread'
          ? trade.gained.messages.flatMap((message) => [
              message.text,
              message.senderProfileURN ?? '',
              message.senderLegalName ?? '',
              message.senderUsername ?? '',
              message.serviceMessageID ?? '',
            ])
          : []),
        ...(trade.gained.assetKind === 'friend_request'
          ? [
              trade.gained.direction,
              trade.gained.serviceTradeID ?? '',
              trade.gained.user.legalName,
              trade.gained.user.username,
              trade.gained.user.avatarURL,
            ]
          : []),
        ...(trade.lost.assetKind === 'message_thread'
          ? trade.lost.messages.flatMap((message) => [
              message.text,
              message.senderProfileURN ?? '',
              message.senderLegalName ?? '',
              message.senderUsername ?? '',
              message.serviceMessageID ?? '',
            ])
          : []),
        ...(trade.lost.assetKind === 'friend_request'
          ? [
              trade.lost.direction,
              trade.lost.serviceTradeID ?? '',
              trade.lost.user.legalName,
              trade.lost.user.username,
              trade.lost.user.avatarURL,
            ]
          : []),
      ].some((token) => token.toLowerCase().includes(query)),
    )
  }, [response, searchText])

  const groupedTrades = useMemo(() => groupTradesByDate(filteredTrades), [filteredTrades])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void fetchTrades({ showLoading: false })
            }}
          />
        }
      >
        <DetailSection title="Filters">
          <RNView style={styles.detailSectionContent}>
            <RNView style={styles.filterRow}>
              <EnumMenu
                title="Date/Time Span"
                label={
                  dateTimeSpan === undefined
                    ? 'Date/Time Span'
                    : `Date/Time Span: ${DATE_TIME_SPANS.find((option) => option.value === dateTimeSpan)?.label ?? dateTimeSpan}`
                }
                active={dateTimeSpan !== undefined}
                visible={showDateTimeSpanModal}
                onOpen={() => {
                  setShowDateTimeSpanModal(true)
                }}
                onClose={() => {
                  setShowDateTimeSpanModal(false)
                }}
                selectedID={dateTimeSpan}
                options={DATE_TIME_SPANS.map((option) => ({
                  id: option.value,
                  label: option.label,
                }))}
                clearOptionLabel="All"
                onClear={() => {
                  setDateTimeSpan(undefined)
                }}
                onSelect={setDateTimeSpan}
              />
              <EnumMenu
                title="Lost Asset Kind"
                label={
                  lostAssetKind === undefined
                    ? 'Lost Asset Kind'
                    : `Lost Asset Kind: ${displayTradeAssetKind(lostAssetKind)}`
                }
                active={lostAssetKind !== undefined}
                visible={showLostAssetKindModal}
                onOpen={() => {
                  setShowLostAssetKindModal(true)
                }}
                onClose={() => {
                  setShowLostAssetKindModal(false)
                }}
                selectedID={lostAssetKind}
                options={TRADE_ASSET_KINDS.map((kind) => ({
                  id: kind,
                  label: displayTradeAssetKind(kind),
                }))}
                clearOptionLabel="All"
                onClear={() => {
                  setLostAssetKind(undefined)
                }}
                onSelect={(id) => {
                  if (
                    id === 'fiat' ||
                    id === 'stock' ||
                    id === 'crypto' ||
                    id === 'transport' ||
                    id === 'event' ||
                    id === 'message_thread' ||
                    id === 'friend_request' ||
                    id === 'other' ||
                    id === 'nothing'
                  ) {
                    setLostAssetKind(id)
                  }
                }}
              />
              <EnumMenu
                title="Gained Asset Kind"
                label={
                  gainedAssetKind === undefined
                    ? 'Gained Asset Kind'
                    : `Gained Asset Kind: ${displayTradeAssetKind(gainedAssetKind)}`
                }
                active={gainedAssetKind !== undefined}
                visible={showGainedAssetKindModal}
                onOpen={() => {
                  setShowGainedAssetKindModal(true)
                }}
                onClose={() => {
                  setShowGainedAssetKindModal(false)
                }}
                selectedID={gainedAssetKind}
                options={TRADE_ASSET_KINDS.map((kind) => ({
                  id: kind,
                  label: displayTradeAssetKind(kind),
                }))}
                clearOptionLabel="All"
                onClear={() => {
                  setGainedAssetKind(undefined)
                }}
                onSelect={(id) => {
                  if (
                    id === 'fiat' ||
                    id === 'stock' ||
                    id === 'crypto' ||
                    id === 'transport' ||
                    id === 'event' ||
                    id === 'message_thread' ||
                    id === 'friend_request' ||
                    id === 'other' ||
                    id === 'nothing'
                  ) {
                    setGainedAssetKind(id)
                  }
                }}
              />
              <EnumMenu
                title="Counterparty Kind"
                label={
                  counterpartyKind === undefined
                    ? 'Counterparty Kind'
                    : `Counterparty Kind: ${displayCounterpartyKind(counterpartyKind)}`
                }
                active={counterpartyKind !== undefined}
                visible={showCounterpartyKindModal}
                onOpen={() => {
                  setShowCounterpartyKindModal(true)
                }}
                onClose={() => {
                  setShowCounterpartyKindModal(false)
                }}
                selectedID={counterpartyKind}
                options={COUNTERPARTY_KINDS.map((kind) => ({
                  id: kind,
                  label: displayCounterpartyKind(kind),
                }))}
                clearOptionLabel="All"
                onClear={() => {
                  setCounterpartyKind(undefined)
                }}
                onSelect={(id) => {
                  if (id === 'merchant' || id === 'user' || id === 'service') {
                    setCounterpartyKind(id)
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
            <RNView style={styles.searchSection}>
              <RNTextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search by asset or counterparty"
                placeholderTextColor="#9ca3af"
                keyboardAppearance="light"
                selectionColor="#111827"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </RNView>
          </RNView>
        </DetailSection>

        <LinkedAccountStatusRefsSection
          state={state.kind}
          linkedAccounts={response?.linkedAccounts}
          emptyMessage="Try changing your filters or linking more services."
        />

        {state.kind === 'initial' ? (
          <DetailSection title="Trades">
            <ContentUnavailableState
              title="Network Error"
              message="Check your connection and pull to refresh."
            />
          </DetailSection>
        ) : state.kind === 'loading' ? (
          <DetailSection title="Trades">
            <LoadingState />
          </DetailSection>
        ) : groupedTrades.length === 0 ? (
          <DetailSection title="Trades">
            {searchText.length === 0 ? (
              <ContentUnavailableState
                title="No Trades"
                message="Try changing your filters or linking more services."
              />
            ) : (
              <ContentUnavailableState
                title="No Results"
                message={`No results for "${searchText}"`}
              />
            )}
          </DetailSection>
        ) : (
          groupedTrades.map((group) => (
            <DetailSection key={group.key} title={group.title}>
              {group.trades.map((trade, index) => (
                <ItemRow
                  key={`${trade.dateTime}-${String(index)}`}
                  title={getTradeTitle(trade)}
                  subtitle={getTradeSubtitle(trade)}
                  logo={{ kind: 'uri', uri: getTradeLogo(trade) }}
                  badges={getTradeBadges(trade)}
                  isLast={index === group.trades.length - 1}
                  value={getTradeValue(trade)}
                  onPress={() => {
                    stackNavigation.push('TradeDetails', { trade })
                  }}
                />
              ))}
            </DetailSection>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
