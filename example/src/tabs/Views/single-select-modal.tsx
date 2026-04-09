import { Ionicons } from '@expo/vector-icons'
import {
  Modal as RNModal,
  Pressable,
  ScrollView as RNScrollView,
  Text as RNText,
} from 'react-native'
import { styles } from '../styles'

export function SingleSelectModal({
  visible,
  onClose,
  title,
  selectedID,
  options,
  onSelect,
  clearOptionLabel,
  onClear,
}: {
  visible: boolean
  onClose: () => void
  title: string
  selectedID?: string | undefined
  options: { id: string; label: string }[]
  onSelect: (id: string) => void
  clearOptionLabel?: string | undefined
  onClear?: (() => void) | undefined
}) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <RNText style={styles.modalTitle}>{title}</RNText>
          <RNScrollView style={styles.modalScroll}>
            {clearOptionLabel === undefined || onClear === undefined ? null : (
              <Pressable
                onPress={() => {
                  onClear()
                  onClose()
                }}
                style={styles.modalRow}
              >
                <Ionicons
                  name={selectedID === undefined ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selectedID === undefined ? '#111827' : '#9ca3af'}
                />
                <RNText style={styles.modalRowLabel}>{clearOptionLabel}</RNText>
              </Pressable>
            )}
            {options.map((option) => {
              const isSelected = selectedID === option.id
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    onSelect(option.id)
                    onClose()
                  }}
                  style={styles.modalRow}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? '#111827' : '#9ca3af'}
                  />
                  <RNText style={styles.modalRowLabel}>{option.label}</RNText>
                </Pressable>
              )
            })}
          </RNScrollView>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}
