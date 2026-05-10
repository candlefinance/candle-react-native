import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  Platform,
  Pressable,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  ScrollView as RNScrollView,
  Text as RNText,
  View as RNView,
} from 'react-native'
import type {
  AssetAccount,
  CounterpartyQuoteRequest,
  LinkedAccount,
  TradeAssetQuoteRequest,
  TradeQuotesRequest,
} from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCounterpartyKindBadge } from '../Extensions/counterparty'
import { getAssetKindBadge } from '../Extensions/trade-asset'
import { LinkedAccountsMenu } from '../Menus/linked-accounts-menu'
import { QUOTE_TEMPLATES } from '../Models/quote-template'
import type {
  CoordinateSelection,
  TradeQuotesFlowNavigationProp,
  TradeQuotesFlowRouteProp,
} from '../Navigation/navigation-types'
import { styles } from '../styles'
import { BadgeChip } from '../Views/badge-chip'
import { CounterpartyQuoteRequestGroup } from '../Views/counterparty-quote-request-group'
import { DetailSection } from '../Views/detail-section'
import { TradeAssetQuoteRequestGroup } from '../Views/trade-asset-quote-request-group'

const applyCoordinateSelectionToRequest = ({
  request,
  selection,
}: {
  request: TradeAssetQuoteRequest
  selection: CoordinateSelection
}): TradeAssetQuoteRequest => {
  if (request.assetKind !== 'transport') {
    return request
  }
  if (selection.target === 'lostOrigin' || selection.target === 'gainedOrigin') {
    return {
      ...request,
      originCoordinates: {
        latitude: selection.latitude,
        longitude: selection.longitude,
      },
    }
  }
  return {
    ...request,
    destinationCoordinates: {
      latitude: selection.latitude,
      longitude: selection.longitude,
    },
  }
}

const normalizeFriendRequestQuoteRequest = ({
  gained,
  lost,
}: {
  gained: TradeAssetQuoteRequest
  lost: TradeAssetQuoteRequest
}): {
  gained: TradeAssetQuoteRequest
  lost: TradeAssetQuoteRequest
} => {
  if (
    gained.assetKind === 'friend_request' &&
    gained.action === 'reject' &&
    lost.assetKind === 'nothing'
  ) {
    return { gained: lost, lost: gained }
  }

  if (
    lost.assetKind === 'friend_request' &&
    lost.action !== 'reject' &&
    gained.assetKind === 'nothing'
  ) {
    return { gained: lost, lost: gained }
  }

  return { gained, lost }
}

export function TradeQuotesRequestScreen({
  linkedAccounts,
  assetAccounts,
}: {
  linkedAccounts: LinkedAccount[]
  assetAccounts: AssetAccount[]
}) {
  const stackNavigation = useNavigation<TradeQuotesFlowNavigationProp<'TradeQuoteRequest'>>()
  const route = useRoute<TradeQuotesFlowRouteProp<'TradeQuoteRequest'>>()
  const template = QUOTE_TEMPLATES.find((item) => item.id === route.params.templateID)
  if (template === undefined) {
    throw new Error(`Unsupported quote template: ${route.params.templateID}`)
  }

  const [lostRequest, setLostRequest] = useState<TradeAssetQuoteRequest>(template.lost)
  const [gainedRequest, setGainedRequest] = useState<TradeAssetQuoteRequest>(template.gained)
  const [counterpartyRequest, setCounterpartyRequest] = useState<
    CounterpartyQuoteRequest | undefined
  >(template.counterparty)
  const [selectedLinkedAccountIDs, setSelectedLinkedAccountIDs] = useState<string[]>([])
  const [areRequested, setAreRequested] = useState(false)
  const [showLinkedAccountModal, setShowLinkedAccountModal] = useState(false)
  const [lastAppliedCoordinateRevision, setLastAppliedCoordinateRevision] = useState<
    number | undefined
  >(undefined)

  useLayoutEffect(() => {
    stackNavigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            stackNavigation.goBack()
          }}
          style={styles.headerTextButton}
        >
          <RNText style={styles.headerTextButtonLabel}>Cancel</RNText>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => {
            setAreRequested(true)
          }}
          style={styles.headerTextButton}
        >
          <RNText style={styles.headerTextButtonLabel}>Request</RNText>
        </Pressable>
      ),
    })
  }, [stackNavigation])

  useEffect(() => {
    setSelectedLinkedAccountIDs((current) =>
      current.filter((id) => linkedAccounts.some((account) => account.linkedAccountID === id)),
    )
  }, [linkedAccounts])

  useEffect(() => {
    const coordinateSelection = route.params.coordinateSelection
    if (
      coordinateSelection === undefined ||
      coordinateSelection.revision === lastAppliedCoordinateRevision
    ) {
      return
    }
    if (
      coordinateSelection.target === 'lostOrigin' ||
      coordinateSelection.target === 'lostDestination'
    ) {
      setLostRequest((current) =>
        applyCoordinateSelectionToRequest({
          request: current,
          selection: coordinateSelection,
        }),
      )
    } else {
      setGainedRequest((current) =>
        applyCoordinateSelectionToRequest({
          request: current,
          selection: coordinateSelection,
        }),
      )
    }
    setLastAppliedCoordinateRevision(coordinateSelection.revision)
  }, [lastAppliedCoordinateRevision, route.params.coordinateSelection])

  useEffect(() => {
    if (!areRequested) {
      return
    }
    const assetRequests = normalizeFriendRequestQuoteRequest({
      gained: gainedRequest,
      lost: lostRequest,
    })
    const request: TradeQuotesRequest<any, any> = {
      linkedAccountIDs:
        selectedLinkedAccountIDs.length === 0 ? undefined : selectedLinkedAccountIDs.join(','),
      lost: assetRequests.lost,
      gained: assetRequests.gained,
      counterparty: counterpartyRequest,
    }
    stackNavigation.navigate('TradeQuotes', { request })
    setAreRequested(false)
  }, [
    areRequested,
    counterpartyRequest,
    gainedRequest,
    lostRequest,
    selectedLinkedAccountIDs,
    stackNavigation,
  ])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <RNKeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.select({ ios: 'padding', default: undefined })}
      >
        <RNScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <DetailSection title="Filters">
            <RNView style={styles.detailSectionContent}>
              <RNView style={styles.filterRow}>
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

          <DetailSection
            title="Lost Asset"
            accessory={
              <BadgeChip badge={getAssetKindBadge({ assetKind: lostRequest.assetKind })} />
            }
          >
            <TradeAssetQuoteRequestGroup
              title="Lost Asset"
              value={lostRequest}
              onChange={setLostRequest}
              onOpenCoordinateDetails={({ latitude, longitude, target }) => {
                stackNavigation.navigate('CoordinateDetails', {
                  requestRouteKey: route.key,
                  target,
                  ...(latitude === undefined ? {} : { latitude }),
                  ...(longitude === undefined ? {} : { longitude }),
                })
              }}
              assetAccounts={assetAccounts}
            />
          </DetailSection>

          <DetailSection
            title="Gained Asset"
            accessory={
              <BadgeChip badge={getAssetKindBadge({ assetKind: gainedRequest.assetKind })} />
            }
          >
            <TradeAssetQuoteRequestGroup
              title="Gained Asset"
              value={gainedRequest}
              onChange={setGainedRequest}
              onOpenCoordinateDetails={({ latitude, longitude, target }) => {
                stackNavigation.navigate('CoordinateDetails', {
                  requestRouteKey: route.key,
                  target,
                  ...(latitude === undefined ? {} : { latitude }),
                  ...(longitude === undefined ? {} : { longitude }),
                })
              }}
              assetAccounts={assetAccounts}
            />
          </DetailSection>

          {counterpartyRequest === undefined ? null : (
            <DetailSection
              title="Counterparty"
              accessory={
                <BadgeChip badge={getCounterpartyKindBadge({ kind: counterpartyRequest.kind })} />
              }
            >
              <CounterpartyQuoteRequestGroup
                value={counterpartyRequest}
                onChange={setCounterpartyRequest}
              />
            </DetailSection>
          )}
        </RNScrollView>
      </RNKeyboardAvoidingView>
    </SafeAreaView>
  )
}
