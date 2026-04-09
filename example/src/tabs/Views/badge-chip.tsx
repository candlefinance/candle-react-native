import { Text as RNText, View as RNView } from 'react-native'
import type { BadgeChip as BadgeChipModel } from '../Models/badge-chip'
import { styles } from '../styles'

const BADGE_TONE_STYLES = {
  black: styles.badgeToneBlack,
  blue: styles.badgeToneBlue,
  brown: styles.badgeToneBrown,
  crimson: styles.badgeToneCrimson,
  cyan: styles.badgeToneCyan,
  gray: styles.badgeToneGray,
  green: styles.badgeToneGreen,
  maroon: styles.badgeToneMaroon,
  orange: styles.badgeToneOrange,
  purple: styles.badgeTonePurple,
  red: styles.badgeToneRed,
  teal: styles.badgeToneTeal,
  yellow: styles.badgeToneYellow,
} as const

export function BadgeChip({ badge }: { badge: BadgeChipModel }) {
  return (
    <RNView style={[styles.badgeChip, BADGE_TONE_STYLES[badge.tone]]}>
      <RNText style={styles.badgeChipLabel}>{badge.text}</RNText>
    </RNView>
  )
}
