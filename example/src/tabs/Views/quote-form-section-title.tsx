import { Text as RNText } from 'react-native'
import { styles } from '../styles'

export function QuoteFormSectionTitle({ title }: { title: string }) {
  return <RNText style={styles.quoteFormSectionTitle}>{title}</RNText>
}
