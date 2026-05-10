import { Ionicons } from '@expo/vector-icons'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import type { ComponentType } from 'react'
import { useEffect, useMemo, useState } from 'react'
import * as ExpoLocation from 'expo-location'
import { ActivityIndicator, Text as RNText, View as RNView } from 'react-native'
import type { MapViewProps, Region } from 'react-native-maps'
import type {
  TradeQuotesFlowNavigationProp,
  TradeQuotesFlowRouteProp,
} from '../Navigation/navigation-types'
import { styles } from '../styles'

type MapsModule = {
  default: ComponentType<MapViewProps>
}

const defaultLatitude = 0
const defaultLongitude = 0
const defaultLatitudeDelta = 100
const defaultLongitudeDelta = 100
const focusedLatitudeDelta = 0.02
const focusedLongitudeDelta = 0.02

const roundCoordinate = (value: number) => Math.round(value * 1_000_000) / 1_000_000

const createRegion = ({
  latitude,
  longitude,
}: {
  latitude: number | undefined
  longitude: number | undefined
}): Region => ({
  latitude: latitude ?? defaultLatitude,
  longitude: longitude ?? defaultLongitude,
  latitudeDelta:
    latitude === undefined || longitude === undefined ? defaultLatitudeDelta : focusedLatitudeDelta,
  longitudeDelta:
    latitude === undefined || longitude === undefined
      ? defaultLongitudeDelta
      : focusedLongitudeDelta,
})

const pushSelectionToRequest = ({
  stackNavigation,
  latitude,
  longitude,
  requestRouteKey,
  target,
}: {
  latitude: number
  longitude: number
  requestRouteKey: string
  stackNavigation: TradeQuotesFlowNavigationProp<'CoordinateDetails'>
  target: TradeQuotesFlowRouteProp<'CoordinateDetails'>['params']['target']
}) => {
  stackNavigation.dispatch({
    ...CommonActions.setParams({
      coordinateSelection: {
        latitude: roundCoordinate(latitude),
        longitude: roundCoordinate(longitude),
        revision: Date.now(),
        target,
      },
    }),
    source: requestRouteKey,
  })
}

export const CoordinatesScreen = () => {
  const stackNavigation = useNavigation<TradeQuotesFlowNavigationProp<'CoordinateDetails'>>()
  const route = useRoute<TradeQuotesFlowRouteProp<'CoordinateDetails'>>()
  const { latitude, longitude, requestRouteKey, target } = route.params
  const [mapsModule, setMapsModule] = useState<MapsModule | undefined>(undefined)
  const [mapsModuleFailed, setMapsModuleFailed] = useState(false)
  const [requestingLocation, setRequestingLocation] = useState(false)
  const [region, setRegion] = useState<Region>(() => createRegion({ latitude, longitude }))
  const [ignoredRegion, setIgnoredRegion] = useState<Region | undefined>(undefined)

  const MapViewComponent = mapsModule?.default

  const hasInitialCoordinates = useMemo(
    () => latitude !== undefined && longitude !== undefined && (latitude !== 0 || longitude !== 0),
    [latitude, longitude],
  )

  useEffect(() => {
    if (mapsModule !== undefined || mapsModuleFailed) {
      return
    }
    void import('react-native-maps')
      .then((mapsImport) => {
        setMapsModule({ default: mapsImport.default })
      })
      .catch(() => {
        setMapsModuleFailed(true)
      })
  }, [mapsModule, mapsModuleFailed])

  useEffect(() => {
    if (hasInitialCoordinates) {
      return
    }
    setRequestingLocation(true)
    void ExpoLocation.requestForegroundPermissionsAsync()
      .then((permission) => {
        if (permission.status !== ExpoLocation.PermissionStatus.GRANTED) {
          return undefined
        }
        return ExpoLocation.getCurrentPositionAsync({})
      })
      .then((position) => {
        if (position === undefined) {
          return
        }
        const nextLatitude = position.coords.latitude
        const nextLongitude = position.coords.longitude
        const nextRegion = createRegion({ latitude: nextLatitude, longitude: nextLongitude })
        setIgnoredRegion(nextRegion)
        setRegion(nextRegion)
        pushSelectionToRequest({
          latitude: nextLatitude,
          longitude: nextLongitude,
          stackNavigation,
          requestRouteKey,
          target,
        })
      })
      .finally(() => {
        setRequestingLocation(false)
      })
  }, [hasInitialCoordinates, requestRouteKey, stackNavigation, target])

  if (MapViewComponent === undefined) {
    return (
      <RNView style={styles.quoteFormCoordinatesMapFallback}>
        <RNText style={styles.quoteFormCoordinatesMapFallbackTitle}>
          {mapsModuleFailed ? 'Map unavailable' : 'Loading map'}
        </RNText>
        <RNText style={styles.quoteFormCoordinatesMapFallbackMessage}>
          {mapsModuleFailed
            ? 'Rebuild the app after native dependency changes, then reopen this detail view.'
            : 'Preparing the coordinate detail view.'}
        </RNText>
      </RNView>
    )
  }

  return (
    <RNView style={styles.quoteFormCoordinatesModalScreen}>
      <MapViewComponent
        style={styles.quoteFormCoordinatesMap}
        region={region}
        showsUserLocation
        onRegionChangeComplete={(nextRegion) => {
          if (
            ignoredRegion !== undefined &&
            roundCoordinate(ignoredRegion.latitude) === roundCoordinate(nextRegion.latitude) &&
            roundCoordinate(ignoredRegion.longitude) === roundCoordinate(nextRegion.longitude) &&
            roundCoordinate(ignoredRegion.latitudeDelta) ===
              roundCoordinate(nextRegion.latitudeDelta) &&
            roundCoordinate(ignoredRegion.longitudeDelta) ===
              roundCoordinate(nextRegion.longitudeDelta)
          ) {
            setIgnoredRegion(undefined)
            return
          }
          setRegion(nextRegion)
          pushSelectionToRequest({
            latitude: nextRegion.latitude,
            longitude: nextRegion.longitude,
            stackNavigation,
            requestRouteKey,
            target,
          })
        }}
      />
      <RNView pointerEvents="none" style={styles.quoteFormCoordinatesCenterMarker}>
        <Ionicons name="location-sharp" size={30} color="#15803d" />
      </RNView>
      {requestingLocation ? (
        <RNView pointerEvents="none" style={styles.quoteFormCoordinatesLoadingBadge}>
          <ActivityIndicator size="small" color="#15803d" />
        </RNView>
      ) : null}
    </RNView>
  )
}
