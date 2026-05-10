import { Slot } from 'expo-router'
import { StatusBar as RNStatusBar } from 'react-native'
import { CandleProvider } from 'react-native-candle'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { candleConfig } from '../src/candle-config'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CandleProvider clientID={candleConfig.clientID}>
          <RNStatusBar backgroundColor="#f2f2f7" barStyle="dark-content" />
          <Slot />
        </CandleProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
