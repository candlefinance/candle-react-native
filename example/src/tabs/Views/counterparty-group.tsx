import { View } from 'react-native'
import type { Counterparty } from 'react-native-candle'
import {
  getCounterpartyBadge,
  getCounterpartyImage,
  getCounterpartyTitle,
} from '../Extensions/counterparty'
import { DetailSection } from './detail-section'
import { InfoHeader } from './info-header'
import { InfoRow } from './info-row'

export function CounterpartyGroup({ counterparty }: { counterparty: Counterparty }) {
  return (
    <DetailSection title="Counterparty">
      <InfoHeader
        logo={{ kind: 'uri', uri: getCounterpartyImage(counterparty) }}
        title={getCounterpartyTitle(counterparty)}
        badges={[getCounterpartyBadge(counterparty)]}
      />
      {counterparty.kind === 'merchant' ? (
        <View>
          {counterparty.location === undefined ? null : (
            <>
              <InfoRow title="Country Code" value={counterparty.location.countryCode} />
              <InfoRow
                title="Country Subdivision Code"
                value={counterparty.location.countrySubdivisionCode}
              />
              <InfoRow title="Locality Name" value={counterparty.location.localityName} />
            </>
          )}
        </View>
      ) : null}
      {counterparty.kind === 'user' ? (
        <InfoRow title="Username" value={counterparty.username} />
      ) : null}
    </DetailSection>
  )
}
