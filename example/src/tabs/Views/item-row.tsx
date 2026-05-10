import { Ionicons } from '@expo/vector-icons'
import { useRef } from 'react'
import { Pressable, Text as RNText, View as RNView } from 'react-native'
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import type { BadgeChip as BadgeChipModel } from '../Models/badge-chip'
import type { Logo } from '../Models/logo'
import { styles } from '../styles'
import { AnyImage } from './any-image'
import { BadgeChip } from './badge-chip'

export function ItemRow({
  title,
  subtitle,
  logo,
  value,
  onPress,
  isLast = false,
  badges = [],
  swipeActions = [],
}: {
  title: string
  subtitle?: string | undefined
  logo: Logo
  value?: string | undefined
  onPress?: (() => void) | undefined
  isLast?: boolean
  badges?: BadgeChipModel[]
  swipeActions?: {
    label: string
    variant?: 'danger' | 'neutral' | 'success'
    onPress: () => void
  }[]
}) {
  const swipeableRef = useRef<SwipeableMethods | null>(null)

  const rowBody = (
    <RNView style={styles.rowMain}>
      <AnyImage logo={logo} size="row" />
      <RNView style={styles.rowTextContainer}>
        <RNText style={styles.rowTitle} numberOfLines={1}>
          {title}
        </RNText>
        {subtitle === undefined ? null : (
          <RNText style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </RNText>
        )}
        {badges.length === 0 ? null : (
          <RNView style={styles.rowBadges}>
            {badges.map((badge) => (
              <BadgeChip key={badge.id} badge={badge} />
            ))}
          </RNView>
        )}
      </RNView>
      <RNView style={styles.rowTrailing}>
        {value === undefined ? null : (
          <RNText style={styles.rowValue} numberOfLines={1}>
            {value}
          </RNText>
        )}
        {onPress === undefined ? null : (
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        )}
      </RNView>
    </RNView>
  )

  const rowContent = (
    <RNView style={[styles.rowCard, isLast ? styles.rowCardLast : null]}>
      {onPress === undefined ? (
        <RNView style={styles.rowMainContent}>{rowBody}</RNView>
      ) : (
        <Pressable onPress={onPress} style={styles.rowMainPressable}>
          <RNView style={styles.rowMainContent}>{rowBody}</RNView>
        </Pressable>
      )}
    </RNView>
  )

  if (swipeActions.length === 0) {
    return rowContent
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      overshootRight={false}
      renderRightActions={() => (
        <RNView style={styles.rowSwipeActions}>
          {swipeActions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => {
                swipeableRef.current?.close()
                action.onPress()
              }}
              style={[
                styles.rowSwipeActionButton,
                action.variant === 'danger'
                  ? styles.rowSwipeActionDanger
                  : action.variant === 'success'
                    ? styles.rowSwipeActionSuccess
                    : styles.rowSwipeActionNeutral,
              ]}
            >
              <RNText style={styles.rowSwipeActionLabel}>{action.label}</RNText>
            </Pressable>
          ))}
        </RNView>
      )}
    >
      {rowContent}
    </ReanimatedSwipeable>
  )
}
