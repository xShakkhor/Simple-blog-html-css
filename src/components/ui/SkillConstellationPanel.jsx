import { useMemo, useState, useEffect } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { portfolioData } from '../../data/content'

const constellationLayout = [
  { x: 18, y: 22 },
  { x: 38, y: 40 },
  { x: 56, y: 52 },
  { x: 76, y: 74 },
  { x: 88, y: 26 },
]

function projectMatchesCategory(project, category) {
  if (!category) return false
  const group = portfolioData.skills.find((item) => item.category === category)
  if (!group) return false
  const tech = project.tech.map((item) => item.toLowerCase())
  return group.skills.some((skill) => tech.includes(skill.toLowerCase()))
}

export default function SkillConstellationPanel() {
  const { isExplored, selectedSkillCategory, setSelectedSkillCategory, setCurrentSection } = usePortfolioStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const linkedProjects = useMemo(() => {
    if (!selectedSkillCategory) return []
    return portfolioData.projects.filter((project) => projectMatchesCategory(project, selectedSkillCategory))
  }, [selectedSkillCategory])

  if (!isExplored) return null

  return (
    <div className={`absolute z-30 glass-panel p-2 sm:p-4 
      ${isMobile 
        ? 'left-2 right-2 top-auto bottom-20 w-auto max-h-[40vh] overflow-y-auto' 
        : 'right-4 top-24 w-[348px]'}`}>
      <div className="mb-2 sm:mb-3 flex items-start justify-between gap-2 sm:gap-3">
        <div>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.24em] text-cyan-nebula">SKILL CONSTELLATION</span>
          {!isMobile && (
            <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-slate">
              Cluster map and linked work
            </div>
          )}
        </div>
        <button
          onClick={() => setSelectedSkillCategory(null)}
          className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-mono text-muted-slate transition-colors hover:border-cyan-nebula/40 hover:text-text-white"
        >
          CLEAR
        </button>
      </div>

      <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-mono tracking-[0.18em] text-muted-slate">CLUSTER MAP</div>
          {selectedSkillCategory && (
            <div className="rounded-full border border-plasma-green/30 bg-plasma-green/10 px-2 py-1 text-[10px] font-mono text-plasma-green">
              {selectedSkillCategory}
            </div>
          )}
        </div>
        <div className="relative h-40 overflow-hidden rounded-xl border border-white/6 bg-space-black/40">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 140" preserveAspectRatio="none">
            {portfolioData.skills.map((skill, index) => {
              const point = constellationLayout[index] || { x: 50, y: 50 }
              const x = (point.x / 100) * 280
              const y = (point.y / 100) * 140
              return (
                <line
                  key={`line-${skill.category}`}
                  x1={140}
                  y1={70}
                  x2={x}
                  y2={y}
                  stroke={skill.color}
                  strokeOpacity={selectedSkillCategory === skill.category ? 0.85 : 0.25}
                  strokeWidth={selectedSkillCategory === skill.category ? 2.5 : 1}
                />
              )
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-nebula/40 bg-space-black/90 px-3 py-1.5 text-[10px] font-mono tracking-[0.14em] text-cyan-nebula shadow-[0_0_24px_rgba(6,182,212,0.18)]">
            PROJECT CORE
          </div>

          {portfolioData.skills.map((skill, index) => {
            const point = constellationLayout[index] || { x: 50, y: 50 }
            const active = selectedSkillCategory === skill.category
            return (
              <button
                key={skill.category}
                onClick={() => setSelectedSkillCategory(active ? null : skill.category)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[10px] font-mono transition-all"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  borderColor: `${skill.color}80`,
                  color: active ? '#F8FAFC' : skill.color,
                  background: active ? `${skill.color}55` : 'rgba(3,0,20,0.84)',
                  boxShadow: active ? `0 0 14px ${skill.color}` : 'none',
                }}
              >
                {skill.category}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-2 text-[10px] font-mono tracking-[0.18em] text-muted-slate">LINKED PROJECTS</div>

        {!selectedSkillCategory && (
          <div className="rounded-xl border border-dashed border-white/10 bg-space-black/35 px-3 py-3 text-xs leading-relaxed text-muted-slate">Select a skill cluster to reveal connected projects.</div>
        )}

        {selectedSkillCategory && linkedProjects.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 bg-space-black/35 px-3 py-3 text-xs leading-relaxed text-muted-slate">No direct tech match found for this cluster yet.</div>
        )}

        {selectedSkillCategory && linkedProjects.length > 0 && (
          <div className="space-y-2">
            {linkedProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setCurrentSection('projects')}
                className="w-full rounded-xl border border-white/10 bg-space-black/70 px-3 py-2.5 text-left transition-colors hover:border-cyan-nebula/60"
              >
                <div className="text-xs font-semibold text-text-white">{project.title}</div>
                <div className="mt-1 text-[10px] text-muted-slate">{project.tech.join(' • ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
