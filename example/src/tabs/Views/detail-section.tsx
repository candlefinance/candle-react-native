import type { ReactNode } from 'react'
import { Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

export function DetailSection({
  title,
  accessory,
  children,
}: {
  title: string
  accessory?: ReactNode
  children: ReactNode
}) {
  return (
    <RNView style={styles.detailSection}>
      <RNView style={styles.detailSectionHeader}>
        <RNText style={styles.detailSectionTitle}>{title}</RNText>
        {accessory === undefined ? null : <RNView>{accessory}</RNView>}
      </RNView>
      <RNView style={styles.detailSectionBody}>{children}</RNView>
    </RNView>
  )
}
