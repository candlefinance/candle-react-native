import * as ExpoLinking from 'expo-linking'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Text as RNText, View as RNView } from 'react-native'
import { useCandle } from 'react-native-candle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NonSensitiveStorage } from '../../src/Storage/nonSensitiveStorage'
import { SKIP_ONBOARDING_KEY } from '../../src/Storage/storage-keys'
import { isHostedAuthCallbackURL } from '../../src/hosted-auth'
import { styles } from '../../src/tabs/styles'

export default function OAuthCallbackScreen() {
  const candle = useCandle()
  const router = useRouter()
  const incomingURL = ExpoLinking.useLinkingURL()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [hasHandledCallback, setHasHandledCallback] = useState(false)

  useEffect(() => {
    if (hasHandledCallback) {
      return
    }

    void (async () => {
      const callbackURL = incomingURL ?? (await ExpoLinking.getInitialURL())

      if (callbackURL === null) {
        return
      }
      setHasHandledCallback(true)

      if (!isHostedAuthCallbackURL(callbackURL)) {
        setErrorMessage('Candle did not receive a valid hosted auth callback URL.')
        return
      }

      try {
        await candle.completeHostedAuthorization(callbackURL)
        await NonSensitiveStorage.setBoolean(SKIP_ONBOARDING_KEY, true)
        router.replace('/')
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in.')
      }
    })()
  }, [candle, hasHandledCallback, incomingURL, router])

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <RNView
        style={{
          alignItems: 'center',
          flex: 1,
          gap: 16,
          justifyContent: 'center',
          padding: 24,
        }}
      >
        {errorMessage === undefined ? (
          <>
            <ActivityIndicator color="#111827" size="large" />
            <RNText style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>
              Finishing sign in...
            </RNText>
          </>
        ) : (
          <>
            <RNText
              style={{
                color: '#111827',
                fontSize: 22,
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              Unable to Sign In
            </RNText>
            <RNText style={{ color: '#6b7280', fontSize: 15, textAlign: 'center' }}>
              {errorMessage}
            </RNText>
            <Pressable
              onPress={() => {
                router.replace('/')
              }}
              style={{
                backgroundColor: '#111827',
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 12,
              }}
            >
              <RNText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                Back to app
              </RNText>
            </Pressable>
          </>
        )}
      </RNView>
    </SafeAreaView>
  )
}
