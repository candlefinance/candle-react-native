import type { ImageSourcePropType } from 'react-native'
import { Image as RNImage, View as RNView } from 'react-native'
import { styles } from '../../styles'

export function ItemPhoto({ source }: { source: ImageSourcePropType }) {
  return (
    <RNView style={styles.onboardingCard}>
      <RNImage source={source} style={styles.onboardingCardImage} />
    </RNView>
  )
}
