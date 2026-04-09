import { Text as RNText, View as RNView } from 'react-native'
import { styles } from '../styles'

export function DetailScrollView({ values }: { values: { path: string; value: string }[] }) {
  return (
    <RNView style={styles.keyValueContainer}>
      {values.map((item) => (
        <RNView key={item.path} style={styles.keyValueRow}>
          <RNText style={styles.keyValuePath}>{item.path}</RNText>
          <RNText selectable style={styles.keyValueValue}>
            {item.value}
          </RNText>
        </RNView>
      ))}
    </RNView>
  )
}
