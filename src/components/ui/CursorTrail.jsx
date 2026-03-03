import { useEffect, useMemo, useRef, useState } from 'react'

const MAX_TRAIL_COUNT = 10

const PRESETS = {
  subtle: {
    trailCount: 6,
    dotEase: 0.2,
    trailEase: 0.3,
    ringScale: 0.88,
    ringSize: 32,
    dotSize: 9,
    trailSize: 5,
    colors: ['#10B981', '#34D399', '#10B981', '#34D399', '#F59E0B', '#10B981'],
  },
  intense: {
    trailCount: 10,
    dotEase: 0.28,
    trailEase: 0.4,
    ringScale: 0.78,
    ringSize: 40,
    dotSize: 12,
    trailSize: 8,
    colors: ['#10B981', '#34D399', '#F59E0B', '#FBBF24', '#10B981', '#F59E0B', '#34D399', '#FBBF24', '#10B981', '#F59E0B'],
  },
}

export default function CursorTrail({ preset = 'intense' }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailRefs = useRef([])
  const [enabled, setEnabled] = useState(false)
  const pressedRef = useRef(false)
  const target = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })
  const trail = useRef(Array.from({ length: MAX_TRAIL_COUNT }, () => ({ x: -100, y: -100 })))
  const activePreset = PRESETS[preset] || PRESETS.intense

  const trailColors = useMemo(() => {
    const full = Array.from({ length: MAX_TRAIL_COUNT }, (_, index) => activePreset.colors[index] || activePreset.colors[activePreset.colors.length - 1])
    return full
  }, [activePreset.colors])

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isEnabled = !coarsePointer && !reduceMotion
    setEnabled(isEnabled)
    document.documentElement.classList.toggle('custom-cursor-enabled', isEnabled)

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
    }
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    let frameId

    const onMove = (event) => {
      target.current.x = event.clientX
      target.current.y = event.clientY
    }

    const onDown = () => {
      pressedRef.current = true
    }
    const onUp = () => {
      pressedRef.current = false
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * activePreset.dotEase
      current.current.y += (target.current.y - current.current.y) * activePreset.dotEase

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) scale(${pressedRef.current ? activePreset.ringScale : 1})`
      }

      for (let i = 0; i < MAX_TRAIL_COUNT; i += 1) {
        const lead = i === 0 ? current.current : trail.current[i - 1]
        trail.current[i].x += (lead.x - trail.current[i].x) * activePreset.trailEase
        trail.current[i].y += (lead.y - trail.current[i].y) * activePreset.trailEase

        const node = trailRefs.current[i]
        if (node) {
          node.style.transform = `translate3d(${trail.current[i].x}px, ${trail.current[i].y}px, 0)`
        }
      }

      frameId = window.requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.cancelAnimationFrame(frameId)
    }
  }, [enabled, activePreset.dotEase, activePreset.ringScale, activePreset.trailEase])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {trailColors.map((color, index) => (
        <div
          key={color + index}
          ref={(el) => {
            trailRefs.current[index] = el
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            height: `${activePreset.trailSize}px`,
            width: `${activePreset.trailSize}px`,
            backgroundColor: color,
            opacity: index < activePreset.trailCount ? 0.5 - index * 0.04 : 0,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 14px ${color}`,
          }}
        />
      ))}

      <div
        ref={ringRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          height: `${activePreset.ringSize}px`,
          width: `${activePreset.ringSize}px`,
          borderColor: 'rgba(16, 185, 129, 0.8)',
          transition: 'transform 120ms ease-out',
          boxShadow: '0 0 28px rgba(16, 185, 129, 0.45), 0 0 48px rgba(245, 158, 11, 0.25)',
        }}
      />

      <div
        ref={dotRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          height: `${activePreset.dotSize}px`,
          width: `${activePreset.dotSize}px`,
          backgroundColor: '#10B981',
          boxShadow: '0 0 20px rgba(16, 185, 129, 1), 0 0 12px rgba(245, 158, 11, 0.9)',
        }}
      />
    </div>
  )
}
