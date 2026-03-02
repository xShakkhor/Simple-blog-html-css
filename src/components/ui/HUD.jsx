import { usePortfolioStore } from '../../store/usePortfolioStore'
import { motion } from 'framer-motion'

const navItems = [
  { id: 'about', label: 'ABOUT', color: '#7C3AED' },
  { id: 'skills', label: 'SKILLS', color: '#06B6D4' },
  { id: 'projects', label: 'PROJECTS', color: '#F59E0B' },
  { id: 'experience', label: 'EXPERIENCE', color: '#10B981' },
  { id: 'contact', label: 'CONTACT', color: '#EC4899' },
]

export default function HUD() {
  const { currentSection, setCurrentSection } = usePortfolioStore()

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        className="glass-panel px-6 py-3 flex items-center gap-2"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentSection(item.id)}
            className="relative px-3 py-1 text-sm font-mono transition-all duration-300"
            style={{
              color: currentSection === item.id ? item.color : '#94A3B8',
              textShadow: currentSection === item.id ? `0 0 10px ${item.color}` : 'none',
            }}
          >
            <motion.span
              animate={{
                scale: currentSection === item.id ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
            
            {currentSection === item.id && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 rounded"
                style={{
                  backgroundColor: `${item.color}20`,
                  border: `1px solid ${item.color}40`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            {index < navItems.length - 1 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-slate/30">
                │
              </span>
            )}
          </button>
        ))}
      </motion.div>
      
      <motion.div 
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs text-muted-slate font-mono">
          Current: <span style={{ color: navItems.find(n => n.id === currentSection)?.color }}>
            {currentSection.toUpperCase()}
          </span>
        </p>
      </motion.div>
    </div>
  )
}
