import { Text as RNText } from 'react-native'
import { styles } from '../styles'

export function SectionTitle({ title }: { title: string }) {
  return <RNText style={styles.sectionTitle}>{title}</RNText>
}
