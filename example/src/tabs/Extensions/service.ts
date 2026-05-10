import type { Service } from 'react-native-candle'

export const displayService = (service: Service): string => service.displayName

export const getServiceLogo = (service: Service): string => service.logoURL
