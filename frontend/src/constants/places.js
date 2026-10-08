export const PLACE_CATEGORY_LABEL = {
  saved: 'Saved',
  transit: 'Transit',
  airport: 'Airport',
  mall: 'Mall',
  education: 'Campus',
  hospital: 'Hospital',
  landmark: 'Landmark',
  market: 'Market',
  food: 'Food & nightlife',
  office: 'Tech park',
  neighborhood: 'Neighbourhood',
}

export const PLACES = [
  { id: 'howrah-junction', name: 'Howrah Junction', address: 'Dr. A.K. Paul Road, Howrah', area: 'Howrah', category: 'transit', lat: 22.583, lng: 88.3468, keywords: ['howrah', 'station', 'train', 'railway', 'jn'] },
  { id: 'sealdah-station', name: 'Sealdah Station', address: 'Belgachia Road, Sealdah', area: 'Sealdah', category: 'transit', lat: 22.5697, lng: 88.3697, keywords: ['sealdah', 'station', 'train', 'railway'] },
  { id: 'baruipur-station', name: 'Baruipur Station', address: 'Station Road, Baruipur', area: 'Baruipur', category: 'transit', lat: 22.376, lng: 88.441, keywords: ['baruipur', 'station', 'train'] },
  { id: 'ballygunge-station', name: 'Ballygunge Station', address: 'Ballygunge Phanri, Kolkata', area: 'Ballygunge', category: 'transit', lat: 22.543, lng: 88.364, keywords: ['ballygunge', 'station', 'train'] },
  { id: 'garia-station', name: 'Garia Station', address: 'Garia, South 24 Parganas', area: 'Garia', category: 'transit', lat: 22.463, lng: 88.375, keywords: ['garia', 'station', 'train'] },
  { id: 'dum-dum-station', name: 'Dum Dum Station', address: 'Gurupada Roy Road, Dum Dum', area: 'Dum Dum', category: 'transit', lat: 22.61, lng: 88.42, keywords: ['dumdum', 'dum dum', 'station', 'train'] },
  { id: 'sector-v-metro', name: 'Sector V Metro Station', address: 'Central Park, Salt Lake Sector V', area: 'Salt Lake', category: 'transit', lat: 22.568, lng: 88.43, keywords: ['metro', 'sector 5', 'sector v', 'east west', 'salt lake'] },
  { id: 'kavi-nazrul-metro', name: 'Kavi Nazrul Metro Station', address: 'Rajarhat Road, New Town', area: 'New Town', category: 'transit', lat: 22.578, lng: 88.457, keywords: ['metro', 'kavi nazrul', 'new town'] },
  { id: 'park-street-metro', name: 'Park Street Metro Station', address: 'Park Street, Kolkata', area: 'Park Street', category: 'transit', lat: 22.553, lng: 88.353, keywords: ['metro', 'park street', 'ps'] },
  { id: 'netaji-airport', name: 'Netaji Subhas Chandra Bose Airport', address: 'New Town Road, Dum Dum, Kolkata', area: 'Dum Dum', category: 'airport', lat: 22.654, lng: 88.4467, keywords: ['airport', 'ccu', 'flight', 'terminal', 'netaji'] },
  { id: 'quest-mall', name: 'Quest Mall', address: '4/1/1 Rashbehari Avenue, Kolkata', area: 'Ballygunge', category: 'mall', lat: 22.527, lng: 88.352, keywords: ['quest', 'mall', 'shopping', 'silver spring'] },
  { id: 'south-city-mall', name: 'South City Mall', address: 'Jadavpur, Kolkata', area: 'Jadavpur', category: 'mall', lat: 22.504, lng: 88.371, keywords: ['south city', 'mall', 'shopping'] },
  { id: 'forum-mall', name: 'Forum Mall', address: '10/3 Elgin Road, Elgin, Kolkata', area: 'Elgin', category: 'mall', lat: 22.534, lng: 88.352, keywords: ['forum', 'mall', 'shopping', 'elgin'] },
  { id: 'city-centre-salt-lake', name: 'City Centre Salt Lake', address: 'BD Block, Sector 1, Salt Lake', area: 'Salt Lake', category: 'mall', lat: 22.576, lng: 88.41, keywords: ['city centre', 'mall', 'shopping', 'salt lake'] },
  { id: 'mani-square', name: 'Mani Square', address: '16/1 Maniktala Main Road, Tangra', area: 'Tangra', category: 'mall', lat: 22.56, lng: 88.396, keywords: ['mani square', 'mall', 'shopping', 'tangra'] },
  { id: 'jadavpur-university', name: 'Jadavpur University', address: '188 Raja SC Mallick Road, Jadavpur', area: 'Jadavpur', category: 'education', lat: 22.499, lng: 88.373, keywords: ['jadavpur', 'university', 'college', 'ju', 'campus'] },
  { id: 'gmit-college', name: 'GMIT College', address: 'Baruipur, Kolkata', area: 'Baruipur', category: 'education', lat: 22.389, lng: 88.439, keywords: ['gmit', 'college', 'campus', 'baruipur'] },
  { id: 'presidency-university', name: 'Presidency University', address: '87/1 College Street, Kolkata', area: 'College Street', category: 'education', lat: 22.577, lng: 88.364, keywords: ['presidency', 'university', 'college', 'campus'] },
  { id: 'st-xaviers-college', name: "St. Xavier's College", address: '30 Park Street, Kolkata', area: 'Park Street', category: 'education', lat: 22.555, lng: 88.351, keywords: ['xaviers', 'xavier', 'college', 'campus', 'sx'] },
  { id: 'amri-hospital', name: 'AMRI Hospital Salt Lake', address: 'DN Block, Sector 5, Salt Lake', area: 'Salt Lake', category: 'hospital', lat: 22.57, lng: 88.433, keywords: ['amri', 'hospital', 'emergency', 'clinic'] },
  { id: 'ruby-hospital', name: 'Ruby General Hospital', address: 'Sukanta Pally, Anandapur, Kolkata', area: 'Anandapur', category: 'hospital', lat: 22.51, lng: 88.392, keywords: ['ruby', 'hospital', 'emergency'] },
  { id: 'sskm-hospital', name: 'SSKM Hospital', address: '244 AJC Bose Road, Kolkata', area: 'ELBIPark', category: 'hospital', lat: 22.553, lng: 88.344, keywords: ['sskm', 'hospital', 'medical college', 'emergency'] },
  { id: 'tata-medical', name: 'Tata Medical Center', address: '14 MAR (EW), New Town, Kolkata', area: 'New Town', category: 'hospital', lat: 22.58, lng: 88.456, keywords: ['tata medical', 'hospital', 'oncology', 'cancer'] },
  { id: 'victoria-memorial', name: 'Victoria Memorial', address: "1 Queen's Way, Kolkata", area: 'Maidan', category: 'landmark', lat: 22.5448, lng: 88.3426, keywords: ['victoria', 'memorial', 'museum', 'maidan'] },
  { id: 'indian-museum', name: 'Indian Museum', address: '27 Jawaharlal Nehru Road, Kolkata', area: 'Park Street', category: 'landmark', lat: 22.558, lng: 88.351, keywords: ['indian museum', 'museum', 'bhati park'] },
  { id: 'kalighat-temple', name: 'Kalighat Kali Temple', address: 'Anil Dutta Road, Kalighat, Kolkata', area: 'Kalighat', category: 'landmark', lat: 22.5323, lng: 88.3477, keywords: ['kalighat', 'temple', 'mandir', 'kali'] },
  { id: 'dakshineswar-temple', name: 'Dakshineswar Kali Temple', address: 'Anandapur Ghat Road, Dakshineswar', area: 'Dakshineswar', category: 'landmark', lat: 22.652, lng: 88.36, keywords: ['dakshineswar', 'temple', 'mandir', 'kali', 'ghat'] },
  { id: 'alipore-zoo', name: 'Alipore Zoo', address: '2A Alipore Road, Kolkata', area: 'Alipore', category: 'landmark', lat: 22.53, lng: 88.349, keywords: ['alipore', 'zoo', 'biological garden'] },
  { id: 'science-city', name: 'Science City', address: 'J.L. Nehru Road, Kolkata', area: 'Tangra', category: 'landmark', lat: 22.548, lng: 88.37, keywords: ['science city', 'science', 'museum'] },
  { id: 'st-pauls-cathedral', name: "St. Paul's Cathedral", address: '16A Mother Teresa Sarani, Kolkata', area: 'Maidan', category: 'landmark', lat: 22.544, lng: 88.348, keywords: ['pauls', 'cathedral', 'church'] },
  { id: 'princep-ghat', name: 'Princep Ghat', address: 'Strand Road, Fort William, Kolkata', area: 'Ganga', category: 'landmark', lat: 22.546, lng: 88.341, keywords: ['princep', 'ghat', 'ganga', 'riverfront'] },
  { id: 'salt-lake-stadium', name: 'Salt Lake Stadium', address: 'Sector II, Bidhannagar, Kolkata', area: 'Salt Lake', category: 'landmark', lat: 22.569, lng: 88.408, keywords: ['salt lake stadium', 'football', 'stadium', 'east bengal', 'mohun bagan'] },
  { id: 'esplanade', name: 'Esplanade', address: 'Dharamtala, Kolkata', area: 'Esplanade', category: 'landmark', lat: 22.559, lng: 88.352, keywords: ['esplanade', 'dharmatala', 'dharamtala'] },
  { id: 'park-street', name: 'Park Street', address: 'Park Street, Kolkata', area: 'Park Street', category: 'food', lat: 22.5539, lng: 88.3531, keywords: ['park street', 'restaurants', 'nightlife', 'food', 'pubs'] },
  { id: 'gariahat-market', name: 'Gariahat Market', address: 'Gariahat Road, Gariahat, Kolkata', area: 'Gariahat', category: 'market', lat: 22.5186, lng: 88.3656, keywords: ['gariahat', 'market', 'shopping', 'street'] },
  { id: 'burrabazar', name: 'Burrabazar', address: 'Burrabazar, Kolkata', area: 'Burrabazar', category: 'market', lat: 22.586, lng: 88.353, keywords: ['burrabazar', 'burra bazar', 'market', 'wholesale'] },
  { id: 'salt-lake-sector-v', name: 'Salt Lake Sector V', address: 'Sector V, Bidhannagar, Kolkata', area: 'Salt Lake', category: 'office', lat: 22.5697, lng: 88.432, keywords: ['sector 5', 'sector v', 'it park', 'tech', 'salt lake', 'office'] },
  { id: 'new-town', name: 'New Town', address: 'New Town, Rajarhat, Kolkata', area: 'New Town', category: 'office', lat: 22.575, lng: 88.45, keywords: ['new town', 'newtown', 'rajarhat', 'action area'] },
  { id: 'rashbehari-avenue', name: 'Rashbehari Avenue', address: 'Rashbehari Avenue, Deshapriya, Kolkata', area: 'Deshapriya', category: 'landmark', lat: 22.525, lng: 88.357, keywords: ['rashbehari', 'avenue', 'deshapriya'] },
  { id: 'baguiati', name: 'Baguiati', address: 'Baguiati, Kolkata', area: 'Baguiati', category: 'neighborhood', lat: 22.585, lng: 88.455, keywords: ['baguiati', 'vip road'] },
  { id: 'bidhannagar', name: 'Bidhannagar', address: 'Bidhannagar, Kolkata', area: 'Bidhannagar', category: 'neighborhood', lat: 22.584, lng: 88.42, keywords: ['bidhannagar', 'salt lake'] },
  { id: 'ultadanga', name: 'Ultadanga', address: 'Ultadanga, Kolkata', area: 'Ultadanga', category: 'neighborhood', lat: 22.573, lng: 88.402, keywords: ['ultadanga', 'bridge'] },
  { id: 'behala-chowrasta', name: 'Behala Chowrasta', address: 'Behala Chowrasta, Kolkata', area: 'Behala', category: 'neighborhood', lat: 22.498, lng: 88.33, keywords: ['behala', 'chowrasta', 'sabermatha'] },
  { id: 'tollygunge', name: 'Tollygunge', address: 'Tollygunge, Kolkata', area: 'Tollygunge', category: 'neighborhood', lat: 22.5255, lng: 88.358, keywords: ['tollygunge', 'tollywood'] },
]

const POPULAR_PLACE_IDS = [
  'netaji-airport',
  'howrah-junction',
  'sealdah-station',
  'salt-lake-sector-v',
  'new-town',
  'park-street',
]

function scorePlace(place, query) {
  const name = place.name.toLowerCase()
  if (name === query) return 100
  if (name.startsWith(query)) return 90
  if (name.split(/\s+/).some((word) => word.startsWith(query))) return 80
  if (name.includes(query)) return 70
  if (place.area.toLowerCase().includes(query)) return 55
  if (place.address.toLowerCase().includes(query)) return 45
  if (place.category.toLowerCase().includes(query)) return 40
  if (place.keywords.some((keyword) => keyword.includes(query))) return 35
  return -1
}

export function searchPlaces(query = '', source = PLACES, limit = 8) {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    if (source === PLACES) return POPULAR_PLACE_IDS.map((id) => PLACES.find((place) => place.id === id)).filter(Boolean)
    return source.slice(0, 6)
  }

  const matches = []
  for (const place of source) {
    const score = scorePlace(place, trimmed)
    if (score >= 0) matches.push({ place, score })
  }
  matches.sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
  return matches.slice(0, limit).map((match) => match.place)
}
