import { Text as RNText, TextInput as RNTextInput, View as RNView } from 'react-native'
import { styles } from '../styles'

export function QuoteFormTextField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  multiline = false,
}: {
  label: string
  placeholder: string
  value: string
  onChangeText: (nextValue: string) => void
  keyboardType?: 'decimal-pad' | 'default' | 'number-pad'
  autoCapitalize?: 'characters' | 'none'
  multiline?: boolean
}) {
  return (
    <RNView style={styles.quoteFormRow}>
      <RNText style={styles.quoteFormLabel}>{label}</RNText>
      <RNTextInput
        style={styles.quoteFormTextInput}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardAppearance="light"
        selectionColor="#111827"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        returnKeyType="done"
      />
    </RNView>
  )
}
