import { useMemo, useState, useEffect } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

const objectives = [
  { key: 'aboutScanned', label: 'Scan About Planet' },
  { key: 'projectUnlocked', label: 'Unlock a Project Moon' },
  { key: 'contactDocked', label: 'Dock at Contact Station' },
]

export default function MissionMode() {
  const { mission, isExplored } = usePortfolioStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const completed = useMemo(
    () => objectives.filter((item) => mission[item.key]).length,
    [mission],
  )

  const progress = Math.round((completed / objectives.length) * 100)
  const isComplete = completed === objectives.length

  if (!isExplored) return null

  return (
    <div className={`absolute z-30 glass-panel px-3 py-2 sm:px-4 sm:py-3.5 
      ${isMobile 
        ? 'left-2 right-2 bottom-32 w-auto' 
        : 'left-4 top-56 w-72'}`}>
      <div className="mb-2 sm:mb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.24em] text-cyan-nebula">MISSION MODE</span>
          {!isMobile && (
            <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-slate">
              Explorer objectives
            </div>
          )}
        </div>
        <span className={`text-xs font-mono ${isComplete ? 'text-plasma-green' : 'text-muted-slate'}`}>
          {completed}/{objectives.length}
        </span>
      </div>

      <div className="mb-3 sm:mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-nebula via-cosmic-violet to-plasma-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {objectives.map((item) => (
          <div key={item.key} className="flex items-start gap-2 rounded-lg sm:rounded-xl border border-white/8 bg-white/5 px-2 py-1.5 text-xs">
            <span
              className={`mt-0.5 inline-block h-2 w-2 rounded-full ${
                mission[item.key] ? 'bg-plasma-green shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'bg-white/30'
              }`}
            />
            <span className={`leading-relaxed ${mission[item.key] ? 'text-text-white' : 'text-muted-slate'}`}>{item.label}</span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-2 sm:mt-3 rounded border border-plasma-green/40 bg-plasma-green/10 px-2 py-1 text-center text-xs font-mono text-plasma-green">
          MISSION COMPLETE: VOID EXPLORER
        </div>
      )}
    </div>
  )
}
