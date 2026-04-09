import { View } from 'react-native'
import type { TradeAsset } from 'react-native-candle'
import { formatDateTime, formatMoney } from '../Extensions/format'
import { getAssetKindBadge, getTradeAssetTitle } from '../Extensions/trade-asset'
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
    </DetailSection>
  )
}
