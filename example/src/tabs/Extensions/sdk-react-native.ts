import sdkReactNativePackage from 'react-native-candle/package.json'

export function getSDKVersion(): string {
  return typeof sdkReactNativePackage.version === 'string'
    ? sdkReactNativePackage.version
    : 'unknown'
}
