import { View } from 'react-native'
import type { TradeAsset } from 'react-native-candle'
import { formatDateTime, formatMoney } from '../Extensions/format'
import { getAssetKindBadge, getTradeAssetTitle } from '../Extensions/trade-asset'
import { styles } from '../styles'
import { DetailSection } from './detail-section'
import { InfoHeader } from './info-header'
import { InfoRow } from './info-row'

const getCurrencySymbol = (currencyCode: string): string => {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
    return (
      formatter.formatToParts(0).find((part) => part.type === 'currency')?.value ?? currencyCode
    )
  } catch {
    return currencyCode
  }
}

const getAssetHeaderLogo = (asset: TradeAsset) => {
  switch (asset.assetKind) {
    case 'fiat': {
      return {
        kind: 'text' as const,
        text: getCurrencySymbol(asset.currencyCode),
        tone: 'teal' as const,
      }
    }
    case 'stock':
    case 'crypto': {
      return {
        kind: 'uri' as const,
        uri: asset.logoURL,
      }
    }
    case 'transport': {
      return {
        kind: 'uri' as const,
        uri: asset.imageURL,
      }
    }
    case 'event': {
      return {
        kind: 'uri' as const,
        uri: asset.imageURL,
      }
    }
    case 'message_thread': {
      return {
        kind: 'symbol' as const,
        symbol: 'chatbubble-ellipses' as const,
        tone: 'blue' as const,
      }
    }
    case 'friend_request': {
      return {
        kind: 'uri' as const,
        uri: asset.user.avatarURL,
      }
    }
    case 'other': {
      return {
        kind: 'symbol' as const,
        symbol: 'ellipsis-horizontal' as const,
        tone: 'gray' as const,
      }
    }
    case 'nothing': {
      return {
        kind: 'symbol' as const,
        symbol: 'gift' as const,
        tone: 'crimson' as const,
      }
    }
  }
}

export function TradeAssetGroup({ title, asset }: { title: string; asset: TradeAsset }) {
  return (
    <DetailSection title={title}>
      <InfoHeader
        logo={getAssetHeaderLogo(asset)}
        title={getTradeAssetTitle(asset)}
        badges={[getAssetKindBadge({ assetKind: asset.assetKind })]}
      />

      {asset.assetKind === 'fiat' ? (
        <View>
          <InfoRow title="Amount" value={formatMoney(asset.amount, asset.currencyCode)} />
          {asset.serviceTradeID === undefined ? null : (
            <InfoRow title="Service Trade ID" value={asset.serviceTradeID} />
          )}
          <InfoRow title="Service Account ID" value={asset.serviceAccountID} />
          <InfoRow title="Linked Account ID" value={asset.linkedAccountID} />
        </View>
      ) : null}

      {asset.assetKind === 'stock' || asset.assetKind === 'crypto' ? (
        <View>
          <InfoRow title="Symbol" value={asset.symbol} />
          <InfoRow title="Amount" value={String(asset.amount)} />
          <InfoRow title="Service Trade ID" value={asset.serviceTradeID} />
          <InfoRow title="Service Asset ID" value={asset.serviceAssetID} />
          <InfoRow title="Service Account ID" value={asset.serviceAccountID} />
          <InfoRow title="Linked Account ID" value={asset.linkedAccountID} />
        </View>
      ) : null}

      {asset.assetKind === 'transport' ? (
        <View>
          <InfoRow title="Description" value={asset.description} />
          <InfoRow title="Departure Date/Time" value={formatDateTime(asset.departureDateTime)} />
          <InfoRow title="Arrival Date/Time" value={formatDateTime(asset.arrivalDateTime)} />
          <InfoRow title="Origin Address" value={asset.originAddress.value} />
          <InfoRow title="Destination Address" value={asset.destinationAddress.value} />
          <InfoRow title="Seats" value={String(asset.seats)} />
          <InfoRow title="Service Trade ID" value={asset.serviceTradeID} />
          <InfoRow title="Service Asset ID" value={asset.serviceAssetID} />
          <InfoRow title="Service Account ID" value={asset.serviceAccountID} />
          <InfoRow title="Linked Account ID" value={asset.linkedAccountID} />
        </View>
      ) : null}

      {asset.assetKind === 'event' ? (
        <View>
          <InfoRow title="Description" value={asset.description} />
          <InfoRow title="Date/Time" value={formatDateTime(asset.dateTime)} />
          <InfoRow title="Location Address" value={asset.locationAddress.value} />
          <InfoRow title="Party Size" value={String(asset.partySize)} />
          <InfoRow title="Service Trade ID" value={asset.serviceTradeID} />
          <InfoRow title="Service Asset ID" value={asset.serviceAssetID} />
          <InfoRow title="Linked Account ID" value={asset.linkedAccountID} />
        </View>
      ) : null}

      {asset.assetKind === 'message_thread' ? (
        <View>
          {asset.serviceTradeID === undefined ? null : (
            <InfoRow title="Service Trade ID" value={asset.serviceTradeID} />
          )}
          <InfoRow title="Messages" value={String(asset.messages.length)} />
          <InfoRow title="Linked Account ID" value={asset.linkedAccountID} />
          <InfoRow title="Service" value={asset.service.displayName} />
          {asset.messages.map((message, index) => (
            <View key={message.serviceMessageID ?? `${String(index)}-${message.text}`}>
              <InfoRow title="Text" value={message.text} />
              {message.dateTime === undefined ? null : (
                <InfoRow title="Date/Time" value={formatDateTime(message.dateTime)} />
              )}
              {message.senderProfileURN === undefined ? null : (
                <InfoRow title="Sender URN" value={message.senderProfileURN} />
              )}
              {message.senderLegalName === undefined ? null : (
                <InfoRow title="Sender Legal Name" value={message.senderLegalName} />
              )}
              {message.senderUsername === undefined ? null : (
                <InfoRow title="Sender Username" value={message.senderUsername} />
              )}
              {message.serviceMessageID === undefined ? null : (
                <InfoRow title="ID" value={message.serviceMessageID} />
              )}
              {index === asset.messages.length - 1 ? null : (
                <View style={styles.messageThreadMessageSpacer} />
              )}
            </View>
          ))}
        </View>
      ) : null}

      {asset.assetKind === 'friend_request' ? (
        <View>
          {asset.serviceTradeID === undefined ? null : (
            <InfoRow title="Service Trade ID" value={asset.serviceTradeID} />
          )}
          <InfoRow title="Direction" value={asset.direction} />
          <InfoRow title="Name" value={asset.user.legalName} />
          <InfoRow title="Username" value={asset.user.username} />
          <InfoRow title="Linked Account ID" value={asset.linkedAccountID} />
          <InfoRow title="Service" value={asset.service.displayName} />
        </View>
      ) : null}
    </DetailSection>
  )
}
