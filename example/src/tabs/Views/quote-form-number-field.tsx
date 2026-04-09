import { useEffect, useState } from 'react'
import { Text as RNText, TextInput as RNTextInput, View as RNView } from 'react-native'
import { styles } from '../styles'

const formatNumericValue = (value: number | undefined) => (value === undefined ? '' : String(value))

const isIntermediateDecimalValue = (value: string) =>
  value === '.' || value === '-' || value === '-.' || value.endsWith('.')

const parseFieldValue = ({
  value,
  keyboardType,
}: {
  value: string
  keyboardType: 'decimal-pad' | 'number-pad'
}) => {
  if (
    value.trim().length === 0 ||
    (keyboardType === 'decimal-pad' && isIntermediateDecimalValue(value))
  ) {
    return undefined
  }
  const parsed =
    keyboardType === 'decimal-pad' ? Number.parseFloat(value) : Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function QuoteFormNumberField({
  label,
  placeholder,
  value,
  onChangeValue,
  keyboardType,
}: {
  label: string
  placeholder: string
  value: number | undefined
  onChangeValue: (nextValue: number | undefined) => void
  keyboardType: 'decimal-pad' | 'number-pad'
}) {
  const [draftValue, setDraftValue] = useState(formatNumericValue(value))
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (isFocused) {
      return
    }
    const formattedValue = formatNumericValue(value)
    if (draftValue === formattedValue) {
      return
    }
    if (keyboardType === 'decimal-pad' && isIntermediateDecimalValue(draftValue)) {
      return
    }
    if (parseFieldValue({ value: draftValue, keyboardType }) === value) {
      return
    }
    setDraftValue(formattedValue)
  }, [draftValue, isFocused, keyboardType, value])

  return (
    <RNView style={styles.quoteFormRow}>
      <RNText style={styles.quoteFormLabel}>{label}</RNText>
      <RNTextInput
        style={
          keyboardType === 'decimal-pad'
            ? styles.quoteFormCoordinateInput
            : styles.quoteFormTextInput
        }
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardAppearance="light"
        selectionColor="#111827"
        value={draftValue}
        onChangeText={(nextValue) => {
          setDraftValue(nextValue)
          if (nextValue.trim().length === 0) {
            onChangeValue(undefined)
            return
          }
          if (keyboardType === 'decimal-pad' && isIntermediateDecimalValue(nextValue)) {
            const parsed = Number.parseFloat(nextValue)
            onChangeValue(Number.isFinite(parsed) ? parsed : undefined)
            return
          }
          onChangeValue(parseFieldValue({ value: nextValue, keyboardType }))
        }}
        onFocus={() => {
          setIsFocused(true)
        }}
        onBlur={() => {
          setIsFocused(false)
          setDraftValue(formatNumericValue(value))
        }}
        keyboardType={keyboardType}
        multiline={false}
        returnKeyType="done"
      />
    </RNView>
  )
}
