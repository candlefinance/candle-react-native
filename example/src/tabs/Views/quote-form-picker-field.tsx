import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

export function QuoteFormPickerField({
  label,
  placeholder,
  value,
  onPress,
}: {
  label: string
  placeholder: string
  value?: string | undefined
  onPress: () => void
}) {
  return (
    <RNView style={styles.quoteFormRow}>
      <RNText style={styles.quoteFormLabel}>{label}</RNText>
      <Pressable style={styles.quoteFormPickerButton} onPress={onPress}>
        <RNText style={value === undefined ? styles.quoteFormPlaceholder : styles.quoteFormValue}>
          {value ?? placeholder}
        </RNText>
        <Ionicons name="chevron-down" size={16} color="#2563eb" />
      </Pressable>
    </RNView>
  )
}
