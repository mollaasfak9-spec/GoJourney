import { useId } from 'react'

const CAR_ACTIVE = 'rgb(var(--color-map-car-active))'
const CAR_IDLE = 'rgb(var(--color-map-car))'
const CAR_GLASS = 'rgb(var(--color-map-road))'
const CAR_WHEEL = 'rgb(var(--color-muted))'
const CAR_WHEEL_ACTIVE = 'rgb(var(--color-map-road))'
const ROAD = 'rgb(var(--color-map-road))'
const ROUTE = 'rgb(var(--color-map-route))'
const PIN = 'rgb(var(--color-pin))'

function Car({ x, y, rotate = 0, highlight = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x="-13" y="-7" width="26" height="14" rx="5" fill={highlight ? CAR_ACTIVE : CAR_IDLE} />
      <rect x="-4.5" y="-4.5" width="9" height="9" rx="2.5" fill={CAR_GLASS} opacity={highlight ? 1 : 0.9} />
      <circle cx="-8" cy="0" r="1.6" fill={highlight ? CAR_WHEEL_ACTIVE : CAR_WHEEL} />
      <circle cx="8" cy="0" r="1.6" fill={highlight ? CAR_WHEEL_ACTIVE : CAR_WHEEL} />
    </g>
  )
}

export default function MapPlaceholder({ className = '' }) {
  const fadeId = useId()

  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Map showing a ride route from downtown to uptown"
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--color-map-fade))" stopOpacity="0.9" />
          <stop offset="30%" stopColor="rgb(var(--color-map-fade))" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="rgb(var(--color-map-block))" />

      <path d="M0 600 L0 424 C92 452 152 522 214 600 Z" fill="rgb(var(--color-map-water))" />
      <path d="M0 424 C92 452 152 522 214 600" fill="none" stroke={ROAD} strokeWidth="6" />

      <rect x="486" y="162" width="82" height="62" rx="14" fill="rgb(var(--color-map-park))" />
      <circle cx="505" cy="180" r="7" fill="rgb(var(--color-map-tree))" />
      <circle cx="528" cy="176" r="6" fill="rgb(var(--color-map-tree))" />
      <circle cx="548" cy="186" r="8" fill="rgb(var(--color-map-tree))" />
      <circle cx="513" cy="204" r="6" fill="rgb(var(--color-map-tree))" />
      <circle cx="540" cy="208" r="7" fill="rgb(var(--color-map-tree))" />

      <g fill="rgb(var(--color-map-building))">
        <rect x="108" y="168" width="72" height="52" rx="8" />
        <rect x="348" y="78" width="104" height="50" rx="8" />
        <rect x="598" y="256" width="46" height="58" rx="8" />
        <rect x="684" y="416" width="60" height="42" rx="8" />
        <rect x="98" y="486" width="92" height="46" rx="8" />
        <rect x="600" y="556" width="46" height="30" rx="8" />
      </g>

      <g fill="none" stroke={ROAD} strokeLinecap="round">
        <path d="M0 150 H800" strokeWidth="20" />
        <path d="M0 330 H800" strokeWidth="26" />
        <path d="M0 470 H800" strokeWidth="18" />
        <path d="M210 0 V600" strokeWidth="22" />
        <path d="M470 0 V600" strokeWidth="26" />
        <path d="M660 0 V600" strokeWidth="16" />

        <path d="M0 60 H800" strokeWidth="10" />
        <path d="M0 240 H800" strokeWidth="9" />
        <path d="M0 400 H800" strokeWidth="9" />
        <path d="M0 550 H800" strokeWidth="10" />
        <path d="M90 0 V600" strokeWidth="9" />
        <path d="M330 0 V600" strokeWidth="9" />
        <path d="M580 0 V600" strokeWidth="9" />
        <path d="M760 0 V600" strokeWidth="9" />
        <path d="M260 320 V470" strokeWidth="9" />

        <path d="M0 540 L260 410 L520 300 L800 180" strokeWidth="14" />
      </g>

      <g>
        <Car x={145} y={250} />
        <Car x={210} y={118} rotate={90} />
        <Car x={260} y={430} rotate={90} />
        <Car x={580} y={540} rotate={90} />
        <Car x={700} y={88} />
        <Car x={352} y={330} highlight />
      </g>

      <path
        d="M60 512 L260 410 L260 330 L470 330 L470 240 L620 240"
        fill="none"
        stroke={ROUTE}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 512 L260 410 L260 330 L470 330 L470 240 L620 240"
        fill="none"
        stroke={ROAD}
        strokeWidth="2.5"
        strokeDasharray="14 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="60" cy="512" r="11" fill={ROAD} />
      <circle cx="60" cy="512" r="7" fill={ROUTE} />

      <g transform="translate(620 240)">
        <path d="M0 6 C-13 -6 -18 -14 -18 -22 A18 18 0 1 1 18 -22 C18 -14 13 -6 0 6 Z" fill={PIN} />
        <circle cx="0" cy="-22" r="6.5" fill={CAR_GLASS} />
      </g>

      <rect width="800" height="180" fill={`url(#${fadeId})`} />
    </svg>
  )
}