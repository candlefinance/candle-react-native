import { ActivityIndicator as RNActivityIndicator, View as RNView } from 'react-native'
import { styles } from '../styles'

export function LoadingState() {
  return (
    <RNView style={styles.loadingStateContainer}>
      <RNActivityIndicator size="large" color="#111827" />
    </RNView>
  )
}
