const UNSPLASH = 'https://images.unsplash.com'

const unsplash = (photoId, width = 800) =>
  `${UNSPLASH}/${photoId}?auto=format&fit=crop&w=${width}&q=70`

const PHOTOS = {
  sedanWhite: 'photo-1749058983952-c7ce95258535',
  sedanWhite2: 'photo-1627028410682-5f777d6ebf13',
  sedanSilver: 'photo-1556161189-78e416f7e934',
  suvGrey: 'photo-1547559418-8d7437f53b5b',
  suvWhite: 'photo-1616262687982-d259dc2a4ce7',
  hatchbackRed: 'photo-1516802270464-32d9aeb7ed58',
  autoYellow: 'photo-1626149637281-4e227308da18',
  bikeScooter: 'photo-1723942092734-be23f468ab95',
  bikeScooter2: 'photo-1679602279551-f07dbb6ce643',
  bikeRider: 'photo-1713246716661-adcbe27c6b5e',
}

export const VEHICLE_TYPE_LABELS = {
  bike: 'Bike',
  auto: 'Auto',
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
}

export const VEHICLE_IMAGES = {
  sedan: unsplash(PHOTOS.sedanWhite),
  suv: unsplash(PHOTOS.suvGrey),
  hatchback: unsplash(PHOTOS.hatchbackRed),
  auto: unsplash(PHOTOS.autoYellow),
  bike: unsplash(PHOTOS.bikeScooter),
}

export function getVehicleImage(vehicleType) {
  return VEHICLE_IMAGES[vehicleType] || unsplash(PHOTOS.sedanWhite)
}

export const AVAILABLE_CARS = [
  {
    id: 'car-1',
    vehicleNumber: 'KA-01-AB-1234',
    driverName: 'Rahul Dey',
    vehicleType: 'sedan',
    brand: 'Toyota',
    model: 'Etios',
    color: 'White',
    seats: 4,
    fare: '18',
    distance: '2.4 km',
    image: unsplash(PHOTOS.sedanWhite),
  },
  {
    id: 'car-2',
    vehicleNumber: 'KA-05-MN-7788',
    driverName: 'Aslam Faruki',
    vehicleType: 'suv',
    brand: 'Hyundai',
    model: 'Creta',
    color: 'Grey',
    seats: 6,
    fare: '26',
    distance: '3.8 km',
    image: unsplash(PHOTOS.suvGrey),
  },
  {
    id: 'car-3',
    vehicleNumber: 'KA-03-QR-4512',
    driverName: 'Rahul Dey',
    vehicleType: 'hatchback',
    brand: 'Maruti',
    model: 'Swift',
    color: 'Red',
    seats: 4,
    fare: '16',
    distance: '1.9 km',
    image: unsplash(PHOTOS.hatchbackRed),
  },
  {
    id: 'car-4',
    vehicleNumber: 'KA-02-ZX-9031',
    driverName: 'Aslam Faruki',
    vehicleType: 'auto',
    brand: 'Bajaj',
    model: 'Auto Rickshaw',
    color: 'Yellow',
    seats: 3,
    fare: '12',
    distance: '1.2 km',
    image: unsplash(PHOTOS.autoYellow),
  },
  {
    id: 'car-5',
    vehicleNumber: 'KA-07-HJ-6620',
    driverName: 'Meera Iyer',
    vehicleType: 'sedan',
    brand: 'Honda',
    model: 'Amaze',
    color: 'Silver',
    seats: 4,
    fare: '19',
    distance: '2.8 km',
    image: unsplash(PHOTOS.sedanSilver),
  },
  {
    id: 'car-6',
    vehicleNumber: 'KA-06-TY-1187',
    driverName: 'Kabir Nair',
    vehicleType: 'suv',
    brand: 'Toyota',
    model: 'Fortuner',
    color: 'White',
    seats: 6,
    fare: '29',
    distance: '4.1 km',
    image: unsplash(PHOTOS.suvWhite),
  },
]

export const AVAILABLE_BIKES = [
  {
    id: 'bike-1',
    vehicleNumber: 'WB-06-MN-3344',
    driverName: 'Suman Roy',
    vehicleType: 'bike',
    brand: 'Honda',
    model: 'Activa 6G',
    color: 'Black',
    seats: 1,
    fare: '9',
    distance: '1.1 km',
    image: unsplash(PHOTOS.bikeScooter, 600),
  },
  {
    id: 'bike-2',
    vehicleNumber: 'WB-02-KL-8899',
    driverName: 'Imran Sheikh',
    vehicleType: 'bike',
    brand: 'TVS',
    model: 'Jupiter',
    color: 'Blue',
    seats: 1,
    fare: '8',
    distance: '0.9 km',
    image: unsplash(PHOTOS.bikeScooter2, 600),
  },
  {
    id: 'bike-3',
    vehicleNumber: 'WB-03-PR-5566',
    driverName: 'Puja Mondal',
    vehicleType: 'bike',
    brand: 'Bajaj',
    model: 'Pulsar 150',
    color: 'Grey',
    seats: 1,
    fare: '11',
    distance: '1.6 km',
    image: unsplash(PHOTOS.bikeRider, 600),
  },
]
