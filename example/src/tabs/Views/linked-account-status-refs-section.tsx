import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, View as RNView } from 'react-native'
import type { LinkedAccountStatusRef } from 'react-native-candle'
import { getLinkedAccountBadges } from '../Extensions/linked-account'
import { getServiceLogo } from '../Extensions/service'
import { styles } from '../styles'
import { AnyImage } from './any-image'
import { BadgeChip } from './badge-chip'
import { ContentUnavailableState } from './content-unavailable-state'
import { DetailSection } from './detail-section'
import { ItemRow } from './item-row'
import { LoadingState } from './loading-state'

export function LinkedAccountStatusRefsSection({
  linkedAccounts,
  state,
  emptyMessage,
}: {
  linkedAccounts: LinkedAccountStatusRef[] | undefined
  state: 'initial' | 'loading' | 'normal'
  emptyMessage: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <DetailSection title="Linked Accounts">
      {state === 'initial' ? (
        <ContentUnavailableState
          title="Network Error"
          message="Check your connection and pull to refresh."
        />
      ) : state === 'loading' ? (
        <LoadingState />
      ) : linkedAccounts === undefined || linkedAccounts.length === 0 ? (
        <ContentUnavailableState title="No Linked Accounts" message={emptyMessage} />
      ) : (
        <RNView>
          <Pressable
            onPress={() => {
              setExpanded((current) => !current)
            }}
            style={[
              styles.linkedAccountsDisclosureButton,
              expanded ? styles.linkedAccountsDisclosureButtonExpanded : null,
            ]}
          >
            <RNView style={styles.linkedAccountsDisclosureSummary}>
              {linkedAccounts.map((account) => (
                <RNView
                  key={`${account.linkedAccountID}:${account.service}:${account.serviceUserID}`}
                  style={styles.linkedAccountsSummaryRow}
                >
                  <AnyImage
                    logo={{ kind: 'uri', uri: getServiceLogo(account.service) }}
                    size="summary"
                  />
                  <RNView style={styles.linkedAccountsSummaryBadges}>
                    {getLinkedAccountBadges(account).map((badge) => (
                      <BadgeChip key={`${account.linkedAccountID}:${badge.id}`} badge={badge} />
                    ))}
                  </RNView>
                </RNView>
              ))}
            </RNView>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
          </Pressable>

          {expanded
            ? linkedAccounts.map((account, index) => (
                <ItemRow
                  key={account.linkedAccountID}
                  title={account.linkedAccountID}
                  value={account.serviceUserID}
                  logo={{ kind: 'uri', uri: getServiceLogo(account.service) }}
                  badges={getLinkedAccountBadges(account)}
                  isLast={index === linkedAccounts.length - 1}
                />
              ))
            : null}
        </RNView>
      )}
    </DetailSection>
  )
}
