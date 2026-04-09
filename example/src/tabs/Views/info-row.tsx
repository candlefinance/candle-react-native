import * as ClipboardModule from 'expo-clipboard'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

export function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <RNView style={styles.infoRow}>
      <RNView style={styles.infoRowTextContainer}>
        <RNText style={styles.infoRowTitle}>{title}</RNText>
        <RNText selectable style={styles.infoRowValue}>
          {value}
        </RNText>
      </RNView>
      <Pressable
        accessibilityLabel={`Copy ${title}`}
        onPress={() => {
          void ClipboardModule.setStringAsync(value)
        }}
        style={styles.infoRowCopyButton}
      >
        <Ionicons name="copy-outline" size={16} color="#6b7280" />
      </Pressable>
    </RNView>
  )
}
