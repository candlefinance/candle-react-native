import packageJson from './package.json'
import type { CandleConfig } from './src/candle-config-types'

const googleMapsApiKey = process.env['GOOGLE_MAPS_API_KEY']
const candleClientID = process.env['EXPO_PUBLIC_CANDLE_CLIENT_ID']
const useExpoAutoSigning = process.env['CANDLE_IOS_USE_EXPO_AUTO_SIGNING'] === '1'
const appleTeamId = useExpoAutoSigning
  ? undefined
  : (process.env['EXPO_IOS_APPLE_TEAM_ID'] ?? 'FW8BZ57ZU9')

if (googleMapsApiKey == null || googleMapsApiKey.length === 0) {
  console.log('==================================================')
  console.log('==================================================')
  console.log('==================================================')
  console.log('WARNING: GOOGLE_MAPS_API_KEY appears to be not set.')
  console.log('Make sure to set it to a valid key before building the app')
  console.log('==================================================')
  console.log('==================================================')
  console.log('==================================================')
}

if (candleClientID == null || candleClientID.length === 0) {
  throw new Error('Set EXPO_PUBLIC_CANDLE_CLIENT_ID before building the app.')
}

const candleConfig = {
  clientID: candleClientID,
} satisfies CandleConfig

const config = {
  name: 'Candle RN',
  slug: 'candle-react-native',
  version: packageJson.version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'candle-rn',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
    imageWidth: 144,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.trycandle.example.expo.ios',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        'Candle uses your location to center the map when you create location-based trade quotes.',
    },
    ...(appleTeamId == null || appleTeamId.length === 0 ? {} : { appleTeamId }),
  },
  android: {
    package: 'com.trycandle.example.expo.android',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#000000',
    },
    permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    config: {
      googleMaps: {
        apiKey: googleMapsApiKey,
      },
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 28,
        },
        ios: {
          buildReactNativeFromSource: true,
          deploymentTarget: '17.0',
        },
      },
    ],
    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    candle: candleConfig,
    router: {
      origin: false,
    },
    eas: {
      projectId: 'a752b6cf-453b-4169-a7d7-c175de80882b',
    },
  },
  owner: 'candle-finance',
}

export default config
