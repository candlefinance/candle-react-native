import { View as RNView } from 'react-native'
import type { CounterpartyQuoteRequest } from 'react-native-candle'
import { styles } from '../styles'
import { QuoteFormTextField } from './quote-form-text-field'

export function CounterpartyQuoteRequestGroup({
  value,
  onChange,
}: {
  value: CounterpartyQuoteRequest
  onChange: (nextValue: CounterpartyQuoteRequest) => void
}) {
  return (
    <RNView style={styles.detailSectionContent}>
      {value.kind === 'merchant' ? (
        <>
          <QuoteFormTextField
            label="Name"
            placeholder="Automatic"
            value={value.name ?? ''}
            onChangeText={(merchantName) => {
              onChange({ ...value, name: merchantName.length === 0 ? undefined : merchantName })
            }}
          />
          <QuoteFormTextField
            label="Locality"
            placeholder="Required"
            value={value.location?.localityName ?? ''}
            onChangeText={(localityName) => {
              const nextLocation =
                localityName.length === 0 &&
                (value.location?.countrySubdivisionCode ?? '').length === 0 &&
                (value.location?.countryCode ?? '').length === 0
                  ? undefined
                  : {
                      localityName,
                      countrySubdivisionCode: value.location?.countrySubdivisionCode ?? '',
                      countryCode: value.location?.countryCode ?? '',
                    }
              onChange({ ...value, location: nextLocation })
            }}
          />
          <QuoteFormTextField
            label="State/Province Code"
            placeholder="Required"
            value={value.location?.countrySubdivisionCode ?? ''}
            onChangeText={(countrySubdivisionCode) => {
              const nextLocation =
                countrySubdivisionCode.length === 0 &&
                (value.location?.localityName ?? '').length === 0 &&
                (value.location?.countryCode ?? '').length === 0
                  ? undefined
                  : {
                      localityName: value.location?.localityName ?? '',
                      countrySubdivisionCode: countrySubdivisionCode.toUpperCase(),
                      countryCode: value.location?.countryCode ?? '',
                    }
              onChange({ ...value, location: nextLocation })
            }}
            autoCapitalize="characters"
          />
          <QuoteFormTextField
            label="Country Code"
            placeholder="Required"
            value={value.location?.countryCode ?? ''}
            onChangeText={(countryCode) => {
              const nextLocation =
                countryCode.length === 0 &&
                (value.location?.localityName ?? '').length === 0 &&
                (value.location?.countrySubdivisionCode ?? '').length === 0
                  ? undefined
                  : {
                      localityName: value.location?.localityName ?? '',
                      countrySubdivisionCode: value.location?.countrySubdivisionCode ?? '',
                      countryCode: countryCode.toUpperCase(),
                    }
              onChange({ ...value, location: nextLocation })
            }}
            autoCapitalize="characters"
          />
        </>
      ) : null}

      {value.kind === 'user' ? (
        <>
          <QuoteFormTextField
            label="Legal Name"
            placeholder="Automatic"
            value={value.legalName ?? ''}
            onChangeText={(legalName) => {
              onChange({ ...value, legalName: legalName.length === 0 ? undefined : legalName })
            }}
          />
          <QuoteFormTextField
            label="Username"
            placeholder="Required"
            value={value.username ?? ''}
            onChangeText={(username) => {
              onChange({ ...value, username: username.length === 0 ? undefined : username })
            }}
          />
        </>
      ) : null}

      {value.kind === 'service' ? null : null}
    </RNView>
  )
}
