import Constants from 'expo-constants'
import type { CandleConfig } from './candle-config-types'

const rawCandleConfig = Constants.expoConfig?.extra?.['candle']

if (rawCandleConfig === undefined) {
  throw new Error(
    'Missing constants. Ensure the Expo config includes a `extra.candle` object that satisfies `CandleConfig` before building the app.',
  )
}

export const candleConfig: CandleConfig = rawCandleConfig
