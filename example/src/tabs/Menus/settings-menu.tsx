import { Alert, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../styles'

export function SettingsMenu({
  onDeleteUser,
  onShowSDKVersion,
}: {
  onDeleteUser: () => void
  onShowSDKVersion: () => void
}) {
  return (
    <Pressable
      onPress={() => {
        Alert.alert('Settings', undefined, [
          { text: 'Delete User', style: 'destructive', onPress: onDeleteUser },
          { text: 'Show Candle Version', onPress: onShowSDKVersion },
          { text: 'Cancel', style: 'cancel' },
        ])
      }}
      style={styles.headerActionButton}
    >
      <Ionicons name="settings-outline" size={20} color="#111827" />
    </Pressable>
  )
}
