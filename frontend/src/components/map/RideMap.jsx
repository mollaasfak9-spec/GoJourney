import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../hooks/useTheme'

const KOLKATA_CENTER = [22.5726, 88.3639]
const DEFAULT_ZOOM = 12

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const PIN_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5a7.5 7.5 0 0 0-7.5 7.5c0 5.5 7.5 13.5 7.5 13.5s7.5-8 7.5-13.5A7.5 7.5 0 0 0 12 1.5Z"/><circle cx="12" cy="9" r="3.1"/></svg>'

const USER_DOT_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="ridex-user-ring" cx="12" cy="12" r="11"/><circle class="ridex-user-dot" cx="12" cy="12" r="4.5"/></svg>'

function createPinIcon(variant) {
  return L.divIcon({
    className: `ridex-marker ridex-marker--${variant}`,
    html: PIN_SVG,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    tooltipAnchor: [0, -42],
  })
}

const PICKUP_ICON = createPinIcon('pickup')
const DROP_ICON = createPinIcon('drop')
const DRIVER_ICON = createPinIcon('driver')

const USER_ICON = L.divIcon({
  className: 'ridex-user-marker',
  html: USER_DOT_SVG,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

// Normalizes either [lat, lng] pairs or { lat, lng } objects to [lat, lng].
function toLatLng(point) {
  if (!point) return null
  if (Array.isArray(point) && point.length >= 2) {
    const lat = Number(point[0])
    const lng = Number(point[1])
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null
  }
  const lat = Number(point.lat)
  const lng = Number(point.lng)
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null
}

function MapEffects({ points }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const invalidate = () => map.invalidateSize()
    const observer = new ResizeObserver(invalidate)
    observer.observe(container)
    const frame = requestAnimationFrame(invalidate)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [map])

  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 14, { animate: true })
      return
    }
    map.fitBounds(L.latLngBounds(points), { padding: [64, 64], maxZoom: 15, animate: true })
  }, [map, points])

  return null
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick?.({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })
  return null
}

export default function RideMap({
  pickup = null,
  destination = null,
  route = null,
  routeApproximate = false,
  driver = null,
  userLocation = null,
  onMapClick,
  className = '',
}) {
  const { isDark } = useTheme()

  const pickupPosition = useMemo(() => toLatLng(pickup), [pickup])
  const destinationPosition = useMemo(() => toLatLng(destination), [destination])
  const driverPosition = useMemo(() => toLatLng(driver), [driver])
  const userPosition = useMemo(() => toLatLng(userLocation), [userLocation])

  const routePositions = useMemo(() => {
    if (Array.isArray(route) && route.length >= 2) {
      return route.map(toLatLng).filter(Boolean)
    }
    return []
  }, [route])

  // Focus the view on every point we have so nothing important is cropped.
  const fitPoints = useMemo(() => {
    const list = []
    if (pickupPosition) list.push(pickupPosition)
    if (destinationPosition) list.push(destinationPosition)
    if (routePositions.length) list.push(...routePositions)
    if (driverPosition) list.push(driverPosition)
    if (userPosition) list.push(userPosition)
    return list
  }, [pickupPosition, destinationPosition, routePositions, driverPosition, userPosition])

  const hasRoadRoute = routePositions.length >= 2
  const straightLine =
    !hasRoadRoute && pickupPosition && destinationPosition ? [pickupPosition, destinationPosition] : []

  const routeColor = isDark ? '#fafaf9' : '#000000'
  const casingColor = isDark ? '#1c1c1c' : '#ffffff'

  return (
    <div className={`ridex-map relative h-full w-full ${className}`}>
      <MapContainer
        center={pickupPosition || KOLKATA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} subdomains="abc" maxZoom={20} />

        {(hasRoadRoute || straightLine.length === 2) && (
          <>
            <Polyline
              positions={hasRoadRoute ? routePositions : straightLine}
              pathOptions={{
                color: casingColor,
                weight: 9,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <Polyline
              positions={hasRoadRoute ? routePositions : straightLine}
              pathOptions={{
                color: routeColor,
                weight: 5,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: hasRoadRoute && routeApproximate ? '8 10' : undefined,
              }}
            />
          </>
        )}

        {pickupPosition && (
          <Marker position={pickupPosition} icon={PICKUP_ICON} keyboard={false}>
            <Tooltip permanent direction="top" className="ridex-tooltip" opacity={1}>
              {pickup?.label || 'Pickup'}
            </Tooltip>
          </Marker>
        )}

        {destinationPosition && (
          <Marker position={destinationPosition} icon={DROP_ICON} keyboard={false}>
            <Tooltip permanent direction="top" className="ridex-tooltip" opacity={1}>
              {destination?.label || 'Drop-off'}
            </Tooltip>
          </Marker>
        )}

        {driverPosition && (
          <Marker position={driverPosition} icon={DRIVER_ICON} keyboard={false}>
            <Tooltip direction="top" className="ridex-tooltip" opacity={1}>
              {driver?.label || 'Your driver'}
            </Tooltip>
          </Marker>
        )}

        {userPosition && <Marker position={userPosition} icon={USER_ICON} keyboard={false} />}

        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        <MapEffects points={fitPoints} />
      </MapContainer>
    </div>
  )
}
