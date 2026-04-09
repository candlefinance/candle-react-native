import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useMemo, useState } from 'react'
import { Platform, View as RNView } from 'react-native'
import type { AssetAccount, TradeAssetQuoteRequest } from 'react-native-candle'
import { displayService } from '../Extensions/service'
import type { CoordinateEditorTarget } from '../Navigation/navigation-types'
import { styles } from '../styles'
import { QuoteFormCoordinatesField } from './quote-form-coordinates-field'
import { QuoteFormDateTimeField } from './quote-form-date-time-field'
import { QuoteFormNumberField } from './quote-form-number-field'
import { QuoteFormPickerField } from './quote-form-picker-field'
import { QuoteFormSectionTitle } from './quote-form-section-title'
import { QuoteFormTextField } from './quote-form-text-field'
import { SingleSelectModal } from './single-select-modal'

const getCurrencyDisplayNames = () => {
  if (typeof Intl.DisplayNames !== 'function') {
    return undefined
  }
  return new Intl.DisplayNames(undefined, { type: 'currency' })
}

const getLocalizedCurrencyName = (currencyCode: string) => {
  const currencyDisplayNames = getCurrencyDisplayNames()
  return currencyDisplayNames?.of(currencyCode) ?? currencyCode
}

const getSupportedCurrencyCodes = () =>
  typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('currency') : []

const normalizeCoordinateInput = ({
  latitude,
  longitude,
}: {
  latitude: number | undefined
  longitude: number | undefined
}) =>
  latitude !== undefined && longitude !== undefined && latitude === 0 && longitude === 0
    ? { latitude: undefined, longitude: undefined }
    : { latitude, longitude }

const defaultEventQuoteDate = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0, 0, 0)
}

const parseEventQuoteDate = (value?: string) => {
  const parsed = value === undefined ? defaultEventQuoteDate() : new Date(value)
  return Number.isNaN(parsed.valueOf()) ? defaultEventQuoteDate() : parsed
}

const toEventQuoteDateTime = (input: {
  current: string | undefined
  nextDate?: Date
  nextTime?: Date
}) => {
  const current = parseEventQuoteDate(input.current)
  const dateValue = input.nextDate ?? current
  const timeValue = input.nextTime ?? current

  return new Date(
    dateValue.getFullYear(),
    dateValue.getMonth(),
    dateValue.getDate(),
    timeValue.getHours(),
    timeValue.getMinutes(),
    0,
    0,
  ).toISOString()
}

const formatEventQuoteDate = (value?: string) => parseEventQuoteDate(value).toLocaleDateString()

const formatEventQuoteTime = (value?: string) =>
  parseEventQuoteDate(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

export function TradeAssetQuoteRequestGroup({
  title,
  value,
  onChange,
  onOpenCoordinateDetails,
  assetAccounts,
}: {
  title: string
  value: TradeAssetQuoteRequest
  onChange: (next: TradeAssetQuoteRequest) => void
  onOpenCoordinateDetails: (input: {
    latitude: number | undefined
    longitude: number | undefined
    target: CoordinateEditorTarget
  }) => void
  assetAccounts: AssetAccount[]
}) {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showEventDatePicker, setShowEventDatePicker] = useState(false)
  const [showEventTimePicker, setShowEventTimePicker] = useState(false)

  const currencyOptions = useMemo(() => {
    const accountCurrencyCodes = assetAccounts
      .filter((account) => account.assetKind === 'fiat')
      .map((account) => account.currencyCode)
    const currencyCodes = new Set([...getSupportedCurrencyCodes(), ...accountCurrencyCodes])
    return [...currencyCodes]
      .map((currencyCode) => ({
        id: currencyCode,
        label: getLocalizedCurrencyName(currencyCode),
      }))
      .sort((left, right) => left.label.localeCompare(right.label))
  }, [assetAccounts])

  const matchingAccounts = useMemo(() => {
    if (value.assetKind === 'fiat') {
      return assetAccounts.filter((account) => account.assetKind === 'fiat')
    }
    if (value.assetKind === 'stock' || value.assetKind === 'crypto') {
      return assetAccounts.filter(
        (account) =>
          (account.assetKind === 'stock' || account.assetKind === 'crypto') &&
          account.assetKind === value.assetKind,
      )
    }
    if (value.assetKind === 'transport') {
      return assetAccounts.filter((account) => account.assetKind === 'transport')
    }
    return []
  }, [assetAccounts, value.assetKind])

  const accountOptions = useMemo(
    () =>
      matchingAccounts.map((account) => ({
        id: account.serviceAccountID,
        label: `${account.nickname} (${displayService(account.service)})`,
      })),
    [matchingAccounts],
  )

  const selectedAccountID =
    value.assetKind === 'fiat' || value.assetKind === 'stock' || value.assetKind === 'crypto'
      ? value.serviceAccountID
      : value.assetKind === 'transport'
        ? value.serviceAccountID
        : undefined
  const selectedAccountLabel = accountOptions.find(
    (option) => option.id === selectedAccountID,
  )?.label
  const selectedCurrencyLabel =
    value.assetKind === 'fiat' && value.currencyCode !== undefined
      ? getLocalizedCurrencyName(value.currencyCode)
      : undefined

  return (
    <RNView style={styles.detailSectionContent}>
      {value.assetKind === 'fiat' ? (
        <RNView style={styles.editorGroup}>
          <QuoteFormPickerField
            label="Currency"
            placeholder="Automatic"
            value={selectedCurrencyLabel}
            onPress={() => {
              setShowCurrencyModal(true)
            }}
          />
          <QuoteFormNumberField
            label="Amount"
            placeholder="Automatic"
            value={value.amount}
            onChangeValue={(amount) => {
              onChange({ ...value, amount })
            }}
            keyboardType="decimal-pad"
          />
          <QuoteFormPickerField
            label="Service Account"
            placeholder="Automatic"
            value={selectedAccountLabel}
            onPress={() => {
              setShowAccountModal(true)
            }}
          />
        </RNView>
      ) : null}

      {value.assetKind === 'stock' || value.assetKind === 'crypto' ? (
        <RNView style={styles.editorGroup}>
          <QuoteFormTextField
            label="Symbol"
            placeholder="Required"
            value={value.symbol ?? ''}
            onChangeText={(symbol) => {
              onChange({ ...value, symbol: symbol.length === 0 ? undefined : symbol.toUpperCase() })
            }}
            autoCapitalize="characters"
          />
          <QuoteFormNumberField
            label="Amount"
            placeholder="Automatic"
            value={value.amount}
            onChangeValue={(amount) => {
              const { amount: _amount, ...rest } = value
              onChange(amount === undefined ? rest : { ...rest, amount })
            }}
            keyboardType="decimal-pad"
          />
          <QuoteFormTextField
            label="Service Asset ID"
            placeholder="Automatic"
            value={value.serviceAssetID ?? ''}
            onChangeText={(serviceAssetID) => {
              const { serviceAssetID: _serviceAssetID, ...rest } = value
              onChange(serviceAssetID.length === 0 ? rest : { ...rest, serviceAssetID })
            }}
          />
          <QuoteFormPickerField
            label="Service Account"
            placeholder="Automatic"
            value={selectedAccountLabel}
            onPress={() => {
              setShowAccountModal(true)
            }}
          />
        </RNView>
      ) : null}

      {value.assetKind === 'transport' ? (
        <RNView style={styles.editorGroup}>
          <RNView style={styles.quoteFormSubsection}>
            <QuoteFormSectionTitle title="Origin" />
            <QuoteFormCoordinatesField
              label="Coordinates"
              latitude={value.originCoordinates?.latitude}
              longitude={value.originCoordinates?.longitude}
              onPress={() => {
                const coordinates = normalizeCoordinateInput({
                  latitude: value.originCoordinates?.latitude,
                  longitude: value.originCoordinates?.longitude,
                })
                onOpenCoordinateDetails({
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  target: title === 'Lost Asset' ? 'lostOrigin' : 'gainedOrigin',
                })
              }}
            />
            <QuoteFormTextField
              label="Address"
              placeholder="Automatic"
              value={value.originAddress?.value ?? ''}
              onChangeText={(originAddress) => {
                const { originAddress: _originAddress, ...rest } = value
                onChange(
                  originAddress.length === 0
                    ? rest
                    : { ...rest, originAddress: { value: originAddress } },
                )
              }}
            />
          </RNView>

          <RNView style={styles.quoteFormSubsection}>
            <QuoteFormSectionTitle title="Destination" />
            <QuoteFormCoordinatesField
              label="Coordinates"
              latitude={value.destinationCoordinates?.latitude}
              longitude={value.destinationCoordinates?.longitude}
              onPress={() => {
                const coordinates = normalizeCoordinateInput({
                  latitude: value.destinationCoordinates?.latitude,
                  longitude: value.destinationCoordinates?.longitude,
                })
                onOpenCoordinateDetails({
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  target: title === 'Lost Asset' ? 'lostDestination' : 'gainedDestination',
                })
              }}
            />
            <QuoteFormTextField
              label="Address"
              placeholder="Automatic"
              value={value.destinationAddress?.value ?? ''}
              onChangeText={(destinationAddress) => {
                const { destinationAddress: _destinationAddress, ...rest } = value
                onChange(
                  destinationAddress.length === 0
                    ? rest
                    : { ...rest, destinationAddress: { value: destinationAddress } },
                )
              }}
            />
          </RNView>

          <QuoteFormNumberField
            label="Seats"
            placeholder="Automatic"
            value={value.seats}
            onChangeValue={(seats) => {
              const { seats: _seats, ...rest } = value
              onChange(seats === undefined ? rest : { ...rest, seats })
            }}
            keyboardType="number-pad"
          />
          <QuoteFormTextField
            label="Service Asset ID"
            placeholder="Automatic"
            value={value.serviceAssetID ?? ''}
            onChangeText={(serviceAssetID) => {
              const { serviceAssetID: _serviceAssetID, ...rest } = value
              onChange(serviceAssetID.length === 0 ? rest : { ...rest, serviceAssetID })
            }}
          />
          <QuoteFormPickerField
            label="Service Account"
            placeholder="Automatic"
            value={selectedAccountLabel}
            onPress={() => {
              setShowAccountModal(true)
            }}
          />
        </RNView>
      ) : null}

      {value.assetKind === 'event' ? (
        <RNView style={styles.editorGroup}>
          {Platform.OS === 'ios' ? (
            <QuoteFormDateTimeField
              date={parseEventQuoteDate(value.dateTime)}
              onChangeDate={(nextDate) => {
                onChange({
                  ...value,
                  dateTime: toEventQuoteDateTime({
                    current: value.dateTime,
                    nextDate,
                  }),
                })
              }}
              onChangeTime={(nextTime) => {
                onChange({
                  ...value,
                  dateTime: toEventQuoteDateTime({
                    current: value.dateTime,
                    nextTime,
                  }),
                })
              }}
            />
          ) : (
            <>
              <QuoteFormPickerField
                label="Date"
                placeholder="Required"
                value={formatEventQuoteDate(value.dateTime)}
                onPress={() => {
                  setShowEventDatePicker(true)
                }}
              />
              <QuoteFormPickerField
                label="Time"
                placeholder="Required"
                value={formatEventQuoteTime(value.dateTime)}
                onPress={() => {
                  setShowEventTimePicker(true)
                }}
              />
            </>
          )}
          <QuoteFormNumberField
            label="Party Size"
            placeholder="Required"
            value={value.partySize}
            onChangeValue={(partySize) => {
              const { partySize: _partySize, ...rest } = value
              onChange(partySize === undefined ? rest : { ...rest, partySize })
            }}
            keyboardType="number-pad"
          />
          <QuoteFormTextField
            label="Service Asset ID"
            placeholder="Automatic"
            value={value.serviceAssetID ?? ''}
            onChangeText={(serviceAssetID) => {
              const { serviceAssetID: _serviceAssetID, ...rest } = value
              onChange(serviceAssetID.length === 0 ? rest : { ...rest, serviceAssetID })
            }}
          />
          {Platform.OS !== 'ios' && showEventDatePicker ? (
            <DateTimePicker
              value={parseEventQuoteDate(value.dateTime)}
              mode="date"
              display="default"
              onChange={(pickerEvent: DateTimePickerEvent, selectedDate?: Date) => {
                setShowEventDatePicker(false)
                if (selectedDate === undefined || pickerEvent.type === 'dismissed') {
                  return
                }
                onChange({
                  ...value,
                  dateTime: toEventQuoteDateTime({
                    current: value.dateTime,
                    nextDate: selectedDate,
                  }),
                })
              }}
            />
          ) : null}
          {Platform.OS !== 'ios' && showEventTimePicker ? (
            <DateTimePicker
              value={parseEventQuoteDate(value.dateTime)}
              mode="time"
              display="default"
              onChange={(pickerEvent: DateTimePickerEvent, selectedTime?: Date) => {
                setShowEventTimePicker(false)
                if (selectedTime === undefined || pickerEvent.type === 'dismissed') {
                  return
                }
                onChange({
                  ...value,
                  dateTime: toEventQuoteDateTime({
                    current: value.dateTime,
                    nextTime: selectedTime,
                  }),
                })
              }}
            />
          ) : null}
        </RNView>
      ) : null}

      <SingleSelectModal
        visible={showCurrencyModal}
        onClose={() => {
          setShowCurrencyModal(false)
        }}
        title="Currency"
        selectedID={value.assetKind === 'fiat' ? value.currencyCode : undefined}
        options={currencyOptions}
        clearOptionLabel="Automatic"
        onClear={() => {
          if (value.assetKind !== 'fiat') {
            return
          }
          const { currencyCode: _currencyCode, ...rest } = value
          onChange(rest)
        }}
        onSelect={(id) => {
          if (value.assetKind !== 'fiat') {
            return
          }
          onChange({ ...value, currencyCode: id })
        }}
      />

      <SingleSelectModal
        visible={showAccountModal}
        onClose={() => {
          setShowAccountModal(false)
        }}
        title="Service Account"
        selectedID={selectedAccountID}
        options={accountOptions}
        clearOptionLabel="Automatic"
        onClear={() => {
          if (
            value.assetKind === 'fiat' ||
            value.assetKind === 'stock' ||
            value.assetKind === 'crypto' ||
            value.assetKind === 'transport'
          ) {
            const { serviceAccountID: _serviceAccountID, ...rest } = value
            onChange(rest)
          }
        }}
        onSelect={(id) => {
          if (
            value.assetKind === 'fiat' ||
            value.assetKind === 'stock' ||
            value.assetKind === 'crypto' ||
            value.assetKind === 'transport'
          ) {
            onChange({ ...value, serviceAccountID: id })
          }
        }}
      />
    </RNView>
  )
}
