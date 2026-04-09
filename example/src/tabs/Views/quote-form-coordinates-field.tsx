import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

const roundCoordinate = (value: number) => Math.round(value * 1_000_000) / 1_000_000

const coordinatesAreSet = ({
  latitude,
  longitude,
}: {
  latitude: number | undefined
  longitude: number | undefined
}) => latitude !== undefined && longitude !== undefined && (latitude !== 0 || longitude !== 0)

const formatCoordinates = ({
  latitude,
  longitude,
}: {
  latitude: number | undefined
  longitude: number | undefined
}) => {
  if (!coordinatesAreSet({ latitude, longitude })) {
    return undefined
  }
  const safeLatitude = latitude ?? 0
  const safeLongitude = longitude ?? 0
  return `${String(roundCoordinate(safeLatitude))}, ${String(roundCoordinate(safeLongitude))}`
}

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
  const coordinateLabel = formatCoordinates({ latitude, longitude })
  const hasCoordinates = coordinateLabel !== undefined

  return (
    <RNView style={styles.quoteFormRow}>
      <RNText style={styles.quoteFormLabel}>{label}</RNText>
      <Pressable style={styles.quoteFormCoordinatesButton} onPress={onPress}>
        <RNText style={hasCoordinates ? styles.quoteFormValue : styles.quoteFormPlaceholder}>
          {coordinateLabel ?? 'Required'}
        </RNText>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </Pressable>
    </RNView>
  )
}
