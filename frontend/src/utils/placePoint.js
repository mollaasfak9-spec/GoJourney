import { PLACES } from '../constants/places'
import { SAVED_PLACES } from '../constants/mockData'

function normalize(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

const SAVED = SAVED_PLACES.map((place) => ({
  name: place.label,
  lat: place.lat,
  lng: place.lng,
  keywords: [place.label, place.address],
}))

export function resolvePlacePoint(place, text = '') {
  if (place && Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
    return { lat: place.lat, lng: place.lng, name: place.label ?? place.name }
  }

  const query = normalize(text)
  if (!query) return null

  const candidates = [...SAVED, ...PLACES]
  let best = null
  let bestScore = -1

  for (const item of candidates) {
    const name = normalize(item.name)
    let score = -1
    if (name === query) score = 100
    else if (name.startsWith(query) || query.startsWith(name)) score = 80
    else if (name.includes(query) || query.includes(name)) score = 60
    else if (
      (item.keywords || []).some((keyword) => {
        const key = normalize(keyword)
        return key && (key === query || query.includes(key) || key.includes(query))
      })
    ) {
      score = 40
    }
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }

  if (!best) return null
  return { lat: best.lat, lng: best.lng, name: best.name }
}

export function placePointFromText(text = '') {
  const point = resolvePlacePoint(null, text)
  return point ? { lat: point.lat, lng: point.lng, label: text } : null
}
