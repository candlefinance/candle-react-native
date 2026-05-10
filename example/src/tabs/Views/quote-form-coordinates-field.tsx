import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

const roundCoordinate = (value: number) => Math.round(value * 1_000_000) / 1_000_000

export function QuoteFormCoordinatesField({
  label,
  latitude,
  longitude,
  onPress,
}: {
  label: string
  latitude: number | undefined
  longitude: number | undefined
  onPress: () => void
}) {
  const coordinateLabel =
    latitude !== undefined && longitude !== undefined && (latitude !== 0 || longitude !== 0)
      ? `${String(roundCoordinate(latitude))}, ${String(roundCoordinate(longitude))}`
      : undefined
  return (
    <RNView style={styles.quoteFormRow}>
      <RNText style={styles.quoteFormLabel}>{label}</RNText>
      <Pressable style={styles.quoteFormCoordinatesButton} onPress={onPress}>
        <RNText
          style={
            coordinateLabel === undefined ? styles.quoteFormPlaceholder : styles.quoteFormValue
          }
        >
          {coordinateLabel ?? 'Required'}
        </RNText>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </Pressable>
    </RNView>
  )
}
