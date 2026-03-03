import { useMemo } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'

const objectives = [
  { key: 'aboutScanned', label: 'Scan About Planet' },
  { key: 'projectUnlocked', label: 'Unlock a Project Moon' },
  { key: 'contactDocked', label: 'Dock at Contact Station' },
]

export default function MissionMode() {
  const { mission, isExplored } = usePortfolioStore()

  const completed = useMemo(
    () => objectives.filter((item) => mission[item.key]).length,
    [mission],
  )

  const progress = Math.round((completed / objectives.length) * 100)
  const isComplete = completed === objectives.length

  if (!isExplored) return null

  return (
    <div className="absolute left-4 top-56 z-30 w-64 glass-panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-mono tracking-wider text-cyan-nebula">MISSION MODE</span>
        <span className={`text-xs font-mono ${isComplete ? 'text-plasma-green' : 'text-muted-slate'}`}>
          {completed}/{objectives.length}
        </span>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded bg-white/10">
        <div
          className="h-full rounded bg-gradient-to-r from-cyan-nebula to-plasma-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {objectives.map((item) => (
          <div key={item.key} className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                mission[item.key] ? 'bg-plasma-green shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'bg-white/30'
              }`}
            />
            <span className={mission[item.key] ? 'text-text-white' : 'text-muted-slate'}>{item.label}</span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-3 rounded border border-plasma-green/40 bg-plasma-green/10 px-2 py-1 text-center text-xs font-mono text-plasma-green">
          MISSION COMPLETE: VOID EXPLORER
        </div>
      )}
    </div>
  )
}
