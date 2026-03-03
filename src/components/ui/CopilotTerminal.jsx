import { useEffect, useMemo, useRef, useState } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { portfolioData } from '../../data/content'

const HELP_LINES = [
  'Available commands:',
  'help - list commands',
  'go about|skills|projects|experience|contact - warp to section',
  'show projects - list project titles',
  'show skills - list skill categories',
  'mission - show mission progress',
  'clear - clear terminal',
]

function parseCommand(input) {
  return input.trim().toLowerCase()
}

export default function CopilotTerminal() {
  const { isExplored, setCurrentSection, mission } = usePortfolioStore()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [lines, setLines] = useState([
    'COSMOS COPILOT ONLINE',
    'Type "help" to get started.',
  ])
  const inputRef = useRef(null)

  const missionStatus = useMemo(() => {
    const done = [mission.aboutScanned, mission.projectUnlocked, mission.contactDocked].filter(Boolean).length
    return `${done}/3 mission objectives complete`
  }, [mission])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '`') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  if (!isExplored) return null

  const pushLines = (newLines) => {
    setLines((prev) => [...prev, ...newLines].slice(-120))
  }

  const runCommand = () => {
    const raw = value
    const cmd = parseCommand(raw)
    if (!cmd) return

    pushLines([`> ${raw}`])

    if (cmd === 'help') {
      pushLines(HELP_LINES)
      setValue('')
      return
    }

    if (cmd.startsWith('go ')) {
      const section = cmd.replace('go ', '').trim()
      const valid = ['about', 'skills', 'projects', 'experience', 'contact']
      if (valid.includes(section)) {
        setCurrentSection(section)
        pushLines([`Warping to ${section.toUpperCase()}...`])
      } else {
        pushLines(['Unknown section. Try: about, skills, projects, experience, contact'])
      }
      setValue('')
      return
    }

    if (cmd === 'show projects') {
      pushLines(['Projects:'])
      pushLines(portfolioData.projects.map((project, index) => `${index + 1}. ${project.title}`))
      setValue('')
      return
    }

    if (cmd === 'show skills') {
      pushLines(['Skill clusters:'])
      pushLines(portfolioData.skills.map((skill, index) => `${index + 1}. ${skill.category}`))
      setValue('')
      return
    }

    if (cmd === 'mission') {
      pushLines([
        `Mission progress: ${missionStatus}`,
        `${mission.aboutScanned ? '[x]' : '[ ]'} Scan About Planet`,
        `${mission.projectUnlocked ? '[x]' : '[ ]'} Unlock Project Moon`,
        `${mission.contactDocked ? '[x]' : '[ ]'} Dock Contact Station`,
      ])
      setValue('')
      return
    }

    if (cmd === 'clear') {
      setLines(['Terminal cleared.', 'Type "help" for commands.'])
      setValue('')
      return
    }

    pushLines(['Command not found. Type "help".'])
    setValue('')
  }

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute bottom-24 right-4 z-30 glass-panel px-3 py-2 text-xs font-mono text-cyan-nebula hover:bg-cosmic-violet/30"
        title="Toggle Copilot Terminal (`)"
      >
        COPILOT
      </button>

      {open && (
        <div className="absolute bottom-36 right-4 z-40 h-80 w-[min(92vw,520px)] overflow-hidden rounded-xl border border-cyan-nebula/30 bg-space-black/90 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <span className="text-xs font-mono text-cyan-nebula">AI COPILOT TERMINAL</span>
            <button
              onClick={() => setOpen(false)}
              className="text-xs font-mono text-muted-slate hover:text-text-white"
            >
              CLOSE
            </button>
          </div>

          <div className="h-[calc(100%-84px)] overflow-y-auto px-3 py-2 font-mono text-xs leading-5 text-muted-slate">
            {lines.map((line, index) => (
              <div key={`${line}-${index}`} className={line.startsWith('>') ? 'text-text-white' : ''}>
                {line}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-2 py-2">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                runCommand()
              }}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-mono text-cyan-nebula">$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Type command..."
                className="w-full bg-transparent text-xs font-mono text-text-white placeholder:text-muted-slate/70 outline-none"
              />
            </form>
          </div>
        </div>
      )}
    </>
  )
}
