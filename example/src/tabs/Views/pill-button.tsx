import { Pressable, Text as RNText } from 'react-native'
import { styles } from '../styles'

export function PillButton({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
    >
      <RNText style={active ? styles.pillActiveText : styles.pillInactiveText}>{label}</RNText>
    </Pressable>
  )
}
