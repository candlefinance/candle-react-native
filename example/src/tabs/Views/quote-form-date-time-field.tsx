import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

const onPickerChange =
  ({ date, onChangeValue }: { date: Date; onChangeValue: (nextValue: Date) => void }) =>
  (pickerEvent: DateTimePickerEvent, nextValue?: Date) => {
    if (pickerEvent.type === 'dismissed') {
      return
    }

    onChangeValue(nextValue ?? date)
  }

export function QuoteFormDateTimeField({
  date,
  onChangeDate,
  onChangeTime,
}: {
  date: Date
  onChangeDate: (nextDate: Date) => void
  onChangeTime: (nextTime: Date) => void
}) {
  return (
    <RNView style={styles.quoteFormRow}>
      <RNText style={styles.quoteFormLabel}>Date/Time</RNText>
      <RNView style={styles.quoteFormDateTimeControls}>
        <RNView style={styles.quoteFormDateTimeControl}>
          <DateTimePicker
            value={date}
            mode="date"
            display="compact"
            onChange={onPickerChange({ date, onChangeValue: onChangeDate })}
          />
        </RNView>
        <RNView style={styles.quoteFormDateTimeControl}>
          <DateTimePicker
            value={date}
            mode="time"
            display="compact"
            onChange={onPickerChange({ date, onChangeValue: onChangeTime })}
          />
        </RNView>
      </RNView>
    </RNView>
  )
}
