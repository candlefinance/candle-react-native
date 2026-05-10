import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Image as RNImage, Text as RNText, View as RNView } from 'react-native'
import type { Logo } from '../Models/logo'
import { styles } from '../styles'

const LOGO_TONE_STYLES = {
  blue: styles.anyImageToneBlue,
  crimson: styles.anyImageToneCrimson,
  gray: styles.anyImageToneGray,
  teal: styles.anyImageToneTeal,
  green: styles.anyImageToneGreen,
  red: styles.anyImageToneRed,
} as const

type AnyImageSize = 'summary' | 'row' | 'header'

const IMAGE_STYLES = {
  summary: styles.anyImageSummary,
  row: styles.anyImageRow,
  header: styles.anyImageHeader,
} as const

const TEXT_STYLES = {
  summary: styles.anyImageTextSummary,
  row: styles.anyImageTextRow,
  header: styles.anyImageTextHeader,
} as const

const ICON_SIZES: Record<AnyImageSize, number> = {
  summary: 12,
  row: 22,
  header: 28,
}

export function AnyImage({ logo, size = 'row' }: { logo: Logo; size?: AnyImageSize }) {
  const imageStyle = IMAGE_STYLES[size]
  const textStyle = TEXT_STYLES[size]
  const imageURI = logo.kind === 'uri' ? logo.uri : undefined
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [imageURI])

  switch (logo.kind) {
    case 'text': {
      return (
        <RNView style={[imageStyle, LOGO_TONE_STYLES[logo.tone]]}>
          <RNText style={textStyle}>{logo.text}</RNText>
        </RNView>
      )
    }
    case 'symbol': {
      return (
        <RNView style={[imageStyle, LOGO_TONE_STYLES[logo.tone]]}>
          <Ionicons name={logo.symbol} size={ICON_SIZES[size]} color="#ffffff" />
        </RNView>
      )
    }
    case 'uri': {
      if (imageFailed || logo.uri === 'https://www.linkedin.com/') {
        return (
          <RNView style={[imageStyle, styles.anyImageToneGray]}>
            <Ionicons name="image" size={ICON_SIZES[size]} color="#ffffff" />
          </RNView>
        )
      }

      return (
        <RNImage
          source={{ uri: logo.uri }}
          style={imageStyle}
          resizeMode="cover"
          onError={() => {
            setImageFailed(true)
          }}
        />
      )
    }
  }
}
