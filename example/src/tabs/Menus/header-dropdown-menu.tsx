import { Ionicons } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  Text as RNText,
  View as RNView,
  type LayoutRectangle,
  type View,
} from 'react-native'
import { styles } from '../styles'

type MenuAction = {
  id: string
  label: string
  icon?: keyof typeof Ionicons.glyphMap
  destructive?: boolean
  onPress: () => void
}

const MENU_WIDTH = 220
const MENU_MARGIN = 12
const SCREEN_PADDING = 16

export const HeaderDropdownMenu = ({
  icon,
  accessibilityLabel,
  actions,
}: {
  icon: keyof typeof Ionicons.glyphMap
  accessibilityLabel: string
  actions: MenuAction[]
}) => {
  const [anchorRect, setAnchorRect] = useState<LayoutRectangle | undefined>(undefined)
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<View | null>(null)

  const openMenu = (view: View | null) => {
    if (view === null) {
      return
    }
    view.measureInWindow((x, y, width, height) => {
      setAnchorRect({ x, y, width, height })
      setVisible(true)
    })
  }

  const closeMenu = () => {
    setVisible(false)
  }

  const menuRight =
    anchorRect === undefined
      ? SCREEN_PADDING
      : Math.max(
          SCREEN_PADDING,
          Dimensions.get('window').width - anchorRect.x - anchorRect.width + SCREEN_PADDING,
        )
  const menuTop =
    anchorRect === undefined ? SCREEN_PADDING : anchorRect.y + anchorRect.height + MENU_MARGIN

  return (
    <>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        onPress={() => {
          openMenu(triggerRef.current)
        }}
        ref={triggerRef}
        style={styles.headerActionButton}
      >
        <Ionicons name={icon} size={22} color="#111827" />
      </Pressable>
      <RNModal
        animationType="fade"
        onRequestClose={closeMenu}
        transparent
        visible={visible}
        statusBarTranslucent
      >
        <Pressable onPress={closeMenu} style={styles.headerMenuBackdrop}>
          <RNView
            style={[
              styles.headerMenuCard,
              {
                right: menuRight,
                top: menuTop,
                width: MENU_WIDTH,
              },
            ]}
          >
            {actions.map((action, index) => (
              <Pressable
                key={action.id}
                onPress={() => {
                  closeMenu()
                  action.onPress()
                }}
                style={[
                  styles.headerMenuItem,
                  index === actions.length - 1 ? undefined : styles.headerMenuItemBorder,
                ]}
              >
                {action.icon === undefined ? null : (
                  <Ionicons
                    color={action.destructive === true ? '#dc2626' : '#111827'}
                    name={action.icon}
                    size={18}
                  />
                )}
                <RNText
                  style={[
                    styles.headerMenuItemLabel,
                    action.destructive === true ? styles.headerMenuItemLabelDestructive : undefined,
                  ]}
                >
                  {action.label}
                </RNText>
              </Pressable>
            ))}
          </RNView>
        </Pressable>
      </RNModal>
    </>
  )
}
