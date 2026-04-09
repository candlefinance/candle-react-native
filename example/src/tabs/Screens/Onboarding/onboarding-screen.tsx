import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  ActivityIndicator as RNActivityIndicator,
  FlatList,
  Image as RNImage,
  Modal as RNModal,
  Pressable,
  StatusBar as RNStatusBar,
  Text as RNText,
  View as RNView,
  type StatusBarProps,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
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

const getNextSlideIndex = (currentIndex: number) => (currentIndex + 1) % onboardingSlides.length

export function OnboardingScreen({
  visible,
  onCreateUser,
  isSubmitting,
}: {
  visible: boolean
  onCreateUser: () => void
  isSubmitting: boolean
}) {
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
    if (isDragging || isSubmitting) {
      return
    }
    const interval = setInterval(() => {
      const nextSlideIndex = getNextSlideIndex(activeSlideIndex)
      listRef.current?.scrollToIndex({
        animated: true,
        index: nextSlideIndex,
      })
      setActiveSlideIndex(nextSlideIndex)
    }, 2500)
    return () => {
      clearInterval(interval)
    }
  }, [activeSlideIndex, isDragging, isSubmitting, visible])

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
          isSubmitting={isSubmitting}
          listRef={listRef}
          onCreateUser={onCreateUser}
          onSetActiveSlideIndex={setActiveSlideIndex}
          onSetIsDragging={setIsDragging}
        />
      </SafeAreaProvider>
    </RNModal>
  )
}

function OnboardingModalContent({
  activeSlideSource,
  isSubmitting,
  listRef,
  onCreateUser,
  onSetActiveSlideIndex,
  onSetIsDragging,
}: {
  activeSlideSource: (typeof onboardingSlides)[number]['source']
  isSubmitting: boolean
  listRef: RefObject<FlatList<(typeof onboardingSlides)[number]> | null>
  onCreateUser: () => void
  onSetActiveSlideIndex: (nextIndex: number) => void
  onSetIsDragging: (isDragging: boolean) => void
}) {
  const insets = useSafeAreaInsets()

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
              const nextIndex = Math.round(
                scrollEvent.nativeEvent.contentOffset.x / getSlideInterval(),
              )
              onSetActiveSlideIndex(nextIndex)
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
            onPress={onCreateUser}
            style={[styles.onboardingCtaButton, isSubmitting ? styles.primaryButtonDisabled : null]}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <RNActivityIndicator color="#111827" />
            ) : (
              <RNText style={styles.onboardingCtaLabel}>Get Started</RNText>
            )}
          </Pressable>
        </RNView>
      </RNView>
    </SafeAreaView>
  )
}
