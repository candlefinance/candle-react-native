import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image as RNImage,
  Linking,
  Modal as RNModal,
  Pressable,
  StatusBar as RNStatusBar,
  Text as RNText,
  View as RNView,
  type StatusBarProps,
} from 'react-native'
import { useCandle } from 'react-native-candle'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { hostedRedirectUri } from '../../../hosted-auth'
import { styles } from '../../styles'
import { ItemPhoto } from './item-photo'
import link1 from '../../../../assets/onboarding/link1.png'
import link2 from '../../../../assets/onboarding/link2.png'
import link3 from '../../../../assets/onboarding/link3.png'
import link4 from '../../../../assets/onboarding/link4.png'
import link5 from '../../../../assets/onboarding/link5.png'
import link6 from '../../../../assets/onboarding/link6.png'
import link7 from '../../../../assets/onboarding/link7.png'

const onboardingCardWidth = 219
const onboardingCardSpacing = 30

const onboardingSlides = [
  { id: 'link1', source: link1 },
  { id: 'link7', source: link7 },
  { id: 'link2', source: link2 },
  { id: 'link6', source: link6 },
  { id: 'link3', source: link3 },
  { id: 'link4', source: link4 },
  { id: 'link5', source: link5 },
] as const

const getSlideInterval = () => onboardingCardWidth + onboardingCardSpacing

export function OnboardingScreen({ visible }: { visible: boolean }) {
  const listRef = useRef<FlatList<(typeof onboardingSlides)[number]>>(null)
  const statusBarEntryRef = useRef<StatusBarProps | null>(null)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const activeSlide = onboardingSlides[activeSlideIndex] ?? onboardingSlides[0]

  useEffect(() => {
    if (!visible) {
      if (statusBarEntryRef.current !== null) {
        RNStatusBar.popStackEntry(statusBarEntryRef.current)
        statusBarEntryRef.current = null
      }
      setActiveSlideIndex(0)
      setIsDragging(false)
      return
    }
    if (isDragging) {
      return
    }
    const interval = setInterval(() => {
      const nextSlideIndex = (activeSlideIndex + 1) % onboardingSlides.length
      listRef.current?.scrollToIndex({
        animated: true,
        index: nextSlideIndex,
      })
      setActiveSlideIndex(nextSlideIndex)
    }, 2500)
    return () => {
      clearInterval(interval)
    }
  }, [activeSlideIndex, isDragging, visible])

  useEffect(() => {
    if (!visible) {
      return
    }

    statusBarEntryRef.current = RNStatusBar.pushStackEntry({
      animated: true,
      backgroundColor: '#000000',
      barStyle: 'light-content',
    })

    return () => {
      if (statusBarEntryRef.current !== null) {
        RNStatusBar.popStackEntry(statusBarEntryRef.current)
        statusBarEntryRef.current = null
      }
    }
  }, [visible])

  return (
    <RNModal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <SafeAreaProvider>
        <OnboardingModalContent
          activeSlideSource={activeSlide.source}
          listRef={listRef}
          onSetActiveSlideIndex={setActiveSlideIndex}
          onSetIsDragging={setIsDragging}
        />
      </SafeAreaProvider>
    </RNModal>
  )
}

function OnboardingModalContent({
  activeSlideSource,
  listRef,
  onSetActiveSlideIndex,
  onSetIsDragging,
}: {
  activeSlideSource: (typeof onboardingSlides)[number]['source']
  listRef: RefObject<FlatList<(typeof onboardingSlides)[number]> | null>
  onSetActiveSlideIndex: (nextIndex: number) => void
  onSetIsDragging: (isDragging: boolean) => void
}) {
  const insets = useSafeAreaInsets()
  const candle = useCandle()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)

  const startHostedSignIn = useCallback(async () => {
    setIsSigningIn(true)
    setSignInError(null)
    try {
      await Linking.openURL(
        candle.makeHostedAuthorizationRequest({ redirectUri: hostedRedirectUri }).url,
      )
    } catch (error) {
      setSignInError(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsSigningIn(false)
    }
  }, [candle])

  return (
    <SafeAreaView style={styles.onboardingContainer} edges={['left', 'right']}>
      <RNImage source={activeSlideSource} style={styles.onboardingBackdropImage} blurRadius={18} />
      <RNView style={styles.onboardingBackdropOverlay} />

      <RNView
        style={[
          styles.onboardingContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        <RNView style={styles.onboardingTitleBlock}>
          <RNText style={styles.onboardingHeading}>Welcome to</RNText>
          <RNText style={styles.onboardingProduct}>Candle</RNText>
          <RNText style={styles.onboardingCaption}>
            Explore the functionality of the Candle SDK
          </RNText>
        </RNView>

        <RNView style={styles.onboardingCarouselWrapper}>
          <FlatList
            ref={listRef}
            data={onboardingSlides}
            keyExtractor={(item) => item.id}
            horizontal
            decelerationRate="fast"
            disableIntervalMomentum
            snapToAlignment="start"
            snapToInterval={getSlideInterval()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.onboardingCarouselContent}
            onMomentumScrollEnd={(scrollEvent) => {
              onSetActiveSlideIndex(
                Math.round(scrollEvent.nativeEvent.contentOffset.x / getSlideInterval()),
              )
            }}
            onScrollBeginDrag={() => {
              onSetIsDragging(true)
            }}
            onScrollEndDrag={() => {
              onSetIsDragging(false)
            }}
            renderItem={({ item }) => <ItemPhoto source={item.source} />}
          />
        </RNView>

        <RNView style={styles.onboardingFooter}>
          <Pressable
            disabled={isSigningIn}
            onPress={() => {
              void startHostedSignIn()
            }}
            style={styles.onboardingCtaButton}
          >
            {isSigningIn ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <RNText style={styles.onboardingCtaLabel}>Sign in with Candle</RNText>
            )}
          </Pressable>
          {signInError === null ? null : (
            <RNText
              style={{
                color: '#ff6961',
                fontSize: 13,
                fontWeight: '600',
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              {signInError}
            </RNText>
          )}
        </RNView>
      </RNView>
    </SafeAreaView>
  )
}
