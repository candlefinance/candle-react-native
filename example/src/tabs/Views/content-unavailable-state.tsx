import { Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

export function ContentUnavailableState({ title, message }: { title: string; message: string }) {
  return (
    <RNView style={styles.sectionEmptyState}>
      <RNText style={styles.sectionEmptyTitle}>{title}</RNText>
      <RNText style={styles.sectionEmptyMessage}>{message}</RNText>
    </RNView>
  )
}
