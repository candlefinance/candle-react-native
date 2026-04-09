import { Ionicons } from '@expo/vector-icons'
import {
  Modal as RNModal,
  Pressable,
  ScrollView as RNScrollView,
  Text as RNText,
} from 'react-native'
import { styles } from '../styles'

export function MultiSelectModal({
  visible,
  onClose,
  title,
  options,
  selected,
  onToggle,
}: {
  visible: boolean
  onClose: () => void
  title: string
  options: { id: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <RNText style={styles.modalTitle}>{title}</RNText>
          <RNScrollView style={styles.modalScroll}>
            {options.map((option) => {
              const isSelected = selected.includes(option.id)
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    onToggle(option.id)
                  }}
                  style={styles.modalRow}
                >
                  <Ionicons
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isSelected ? '#111827' : '#9ca3af'}
                  />
                  <RNText style={styles.modalRowLabel}>{option.label}</RNText>
                </Pressable>
              )
            })}
          </RNScrollView>
          <Pressable style={styles.primaryButton} onPress={onClose}>
            <RNText style={styles.primaryButtonText}>Done</RNText>
          </Pressable>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}
