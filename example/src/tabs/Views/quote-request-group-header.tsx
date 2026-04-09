import { Text as RNText, View as RNView } from 'react-native'
import type { BadgeChip as BadgeChipModel } from '../Models/badge-chip'
import { styles } from '../styles'
import { BadgeChip } from './badge-chip'

export function QuoteRequestGroupHeader({
  title,
  badge,
}: {
  title: string
  badge: BadgeChipModel
}) {
  return (
    <RNView style={styles.editorHeaderRow}>
      <RNText style={styles.editorTitle}>{title}</RNText>
      <BadgeChip badge={badge} />
    </RNView>
  )
}
