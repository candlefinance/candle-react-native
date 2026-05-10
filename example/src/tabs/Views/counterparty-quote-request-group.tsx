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
              onChange({
                ...value,
                location:
                  localityName.length === 0 &&
                  (value.location?.countrySubdivisionCode ?? '').length === 0 &&
                  (value.location?.countryCode ?? '').length === 0
                    ? undefined
                    : {
                        localityName,
                        countrySubdivisionCode: value.location?.countrySubdivisionCode ?? '',
                        countryCode: value.location?.countryCode ?? '',
                      },
              })
            }}
          />
          <QuoteFormTextField
            label="State/Province Code"
            placeholder="Required"
            value={value.location?.countrySubdivisionCode ?? ''}
            onChangeText={(countrySubdivisionCode) => {
              onChange({
                ...value,
                location:
                  countrySubdivisionCode.length === 0 &&
                  (value.location?.localityName ?? '').length === 0 &&
                  (value.location?.countryCode ?? '').length === 0
                    ? undefined
                    : {
                        localityName: value.location?.localityName ?? '',
                        countrySubdivisionCode: countrySubdivisionCode.toUpperCase(),
                        countryCode: value.location?.countryCode ?? '',
                      },
              })
            }}
            autoCapitalize="characters"
          />
          <QuoteFormTextField
            label="Country Code"
            placeholder="Required"
            value={value.location?.countryCode ?? ''}
            onChangeText={(countryCode) => {
              onChange({
                ...value,
                location:
                  countryCode.length === 0 &&
                  (value.location?.localityName ?? '').length === 0 &&
                  (value.location?.countrySubdivisionCode ?? '').length === 0
                    ? undefined
                    : {
                        localityName: value.location?.localityName ?? '',
                        countrySubdivisionCode: value.location?.countrySubdivisionCode ?? '',
                        countryCode: countryCode.toUpperCase(),
                      },
              })
            }}
            autoCapitalize="characters"
          />
        </>
      ) : null}

      {value.kind === 'user' ? (
        <>
          <QuoteFormTextField
            label="Legal Name"
            placeholder="Required if username empty"
            value={value.legalName ?? ''}
            onChangeText={(legalName) => {
              onChange({ ...value, legalName: legalName.length === 0 ? undefined : legalName })
            }}
          />
          <QuoteFormTextField
            label="Username"
            placeholder="Required if legal name empty"
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
