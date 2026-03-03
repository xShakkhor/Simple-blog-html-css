import { useEffect, useMemo, useState } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

const EVENTS = [
  {
    id: 'solar-flare',
    label: 'SOLAR FLARE DETECTED',
    duration: 2400,
    accent: '#F59E0B',
  },
  {
    id: 'comms-blackout',
    label: 'COMMS BLACKOUT',
    duration: 2000,
    accent: '#EF4444',
  },
  {
    id: 'meteor-shower',
    label: 'METEOR SHOWER CROSSING',
    duration: 3000,
    accent: '#06B6D4',
  },
  {
    id: 'nebula-pulse',
    label: 'NEBULA PULSE WAVE',
    duration: 2600,
    accent: '#7C3AED',
  },
  {
    id: 'system-reboot',
    label: 'STARLINK CALIBRATION',
    duration: 2200,
    accent: '#10B981',
  },
]

function randomEvent() {
  return EVENTS[Math.floor(Math.random() * EVENTS.length)]
}

export default function UniverseEvents({ onEventChange }) {
  const { isExplored } = usePortfolioStore()
  const [event, setEvent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [meteorSeed, setMeteorSeed] = useState(0)

  const meteorLanes = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => ({
      top: ((index * 7 + meteorSeed * 13) % 85) + 5,
      delay: ((index * 0.17 + meteorSeed * 0.11) % 1.6).toFixed(2),
      duration: (1.1 + ((index * 0.19 + meteorSeed * 0.07) % 1.4)).toFixed(2),
      size: 40 + ((index * 11 + meteorSeed * 17) % 70),
      opacity: 0.25 + ((index * 0.09 + meteorSeed * 0.03) % 0.45),
    }))
  }, [meteorSeed])

  useEffect(() => {
    if (!isExplored) return undefined

    let hideTimer
    const eventTimer = window.setInterval(() => {
      const next = randomEvent()
      setEvent(next)
      if (next.id === 'meteor-shower') {
        setMeteorSeed((prev) => prev + 1)
      }
      setVisible(true)
      hideTimer = window.setTimeout(() => {
        setVisible(false)
      }, next.duration)
    }, 26000)

    return () => {
      window.clearInterval(eventTimer)
      if (hideTimer) window.clearTimeout(hideTimer)
    }
  }, [isExplored])

  useEffect(() => {
    if (!onEventChange) return
    if (!visible || !event) {
      onEventChange(null)
      return
    }
    onEventChange(event.id)
  }, [event, onEventChange, visible])

  if (!isExplored || !event) return null

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {event.id === 'solar-flare' && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.35),rgba(245,158,11,0.03),transparent_65%)] animate-pulse" />
        )}

        {event.id === 'comms-blackout' && (
          <>
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_4px] opacity-40 animate-pulse" />
          </>
        )}

        {event.id === 'meteor-shower' && (
          <div className="absolute inset-0 overflow-hidden">
            {meteorLanes.map((lane, index) => (
              <span
                key={`meteor-${lane.top}-${index}`}
                className="absolute left-[-120px] h-[2px] bg-gradient-to-r from-transparent via-cyan-nebula to-transparent"
                style={{
                  top: `${lane.top}%`,
                  width: `${lane.size}px`,
                  opacity: lane.opacity,
                  animationName: 'meteor-sweep',
                  animationDuration: `${lane.duration}s`,
                  animationDelay: `${lane.delay}s`,
                  animationIterationCount: 'infinite',
                  transform: 'rotate(-16deg)',
                  boxShadow: '0 0 14px rgba(6,182,212,0.6)',
                }}
              />
            ))}
          </div>
        )}

        {event.id === 'nebula-pulse' && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.28),rgba(6,182,212,0.14),transparent_72%)] animate-pulse" />
        )}

        {event.id === 'system-reboot' && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(16,185,129,0.12)_0,rgba(16,185,129,0.12)_2px,transparent_2px,transparent_6px)] animate-pulse" />
        )}
      </div>

      <div
        className={`pointer-events-none absolute left-1/2 top-16 z-40 -translate-x-1/2 transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <div className="glass-panel px-4 py-2 text-center">
          <div className="text-[10px] font-mono tracking-[0.25em] text-muted-slate">UNIVERSE EVENT</div>
          <div className="text-xs font-mono tracking-wide" style={{ color: event.accent }}>
            {event.label}
          </div>
        </div>
      </div>
    </>
  )
}
