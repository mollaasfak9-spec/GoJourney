import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
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
      map.setView([points[0].lat, points[0].lng], 14, { animate: true })
      return
    }
    map.fitBounds(
      L.latLngBounds(points.map((point) => [point.lat, point.lng])),
      { padding: [64, 64], maxZoom: 15, animate: true },
    )
  }, [map, points])

  return null
}

export default function RideMap({ pickup = null, destination = null, className = '' }) {
  const { isDark } = useTheme()

  const pickupLat = pickup?.lat
  const pickupLng = pickup?.lng
  const destinationLat = destination?.lat
  const destinationLng = destination?.lng

  const points = useMemo(() => {
    const list = []
    if (Number.isFinite(pickupLat) && Number.isFinite(pickupLng)) list.push({ lat: pickupLat, lng: pickupLng })
    if (Number.isFinite(destinationLat) && Number.isFinite(destinationLng)) {
      list.push({ lat: destinationLat, lng: destinationLng })
    }
    return list
  }, [pickupLat, pickupLng, destinationLat, destinationLng])

  const routePositions = useMemo(
    () => points.map((point) => [point.lat, point.lng]),
    [points],
  )

  const routeColor = isDark ? '#fafaf9' : '#000000'
  const casingColor = isDark ? '#1c1c1c' : '#ffffff'

  return (
    <div className={`ridex-map relative h-full w-full ${className}`}>
      <MapContainer
        center={points[0] ? [points[0].lat, points[0].lng] : KOLKATA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTRIBUTION}
          subdomains="abc"
          maxZoom={20}
        />

        {points.length === 2 && (
          <>
            <Polyline
              positions={routePositions}
              pathOptions={{ color: casingColor, weight: 9, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
            />
            <Polyline
              positions={routePositions}
              pathOptions={{ color: routeColor, weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
            />
          </>
        )}

        {points[0] && (
          <Marker position={[points[0].lat, points[0].lng]} icon={PICKUP_ICON} keyboard={false}>
            <Tooltip permanent direction="top" className="ridex-tooltip" opacity={1}>
              {pickup?.label || 'Pickup'}
            </Tooltip>
          </Marker>
        )}

        {points[1] && (
          <Marker position={[points[1].lat, points[1].lng]} icon={DROP_ICON} keyboard={false}>
            <Tooltip permanent direction="top" className="ridex-tooltip" opacity={1}>
              {destination?.label || 'Drop-off'}
            </Tooltip>
          </Marker>
        )}

        <MapEffects points={points} />
      </MapContainer>
    </div>
  )
}
