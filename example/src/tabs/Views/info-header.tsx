import { Text as RNText, View as RNView } from 'react-native'
import type { BadgeChip as BadgeChipModel } from '../Models/badge-chip'
import type { Logo } from '../Models/logo'
import { styles } from '../styles'
import { AnyImage } from './any-image'
import { BadgeChip } from './badge-chip'

export function InfoHeader({
  logo,
  title,
  badges,
}: {
  logo: Logo
  title: string
  badges: BadgeChipModel[]
}) {
  return (
    <RNView style={styles.infoHeaderContainer}>
      <AnyImage logo={logo} size="header" />
      <RNView style={styles.infoHeaderContent}>
        <RNText style={styles.infoHeaderTitle}>{title}</RNText>
        <RNView style={styles.infoHeaderBadges}>
          {badges.map((badge) => (
            <BadgeChip key={badge.id} badge={badge} />
          ))}
        </RNView>
      </RNView>
    </RNView>
  )
}
