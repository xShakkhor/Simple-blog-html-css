import { useState, useEffect, useRef } from 'react'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, HardDrive } from 'lucide-react'

function StatsMonitor() {
  const { isExplored } = usePortfolioStore()
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isExplored) return

    let animationId
    lastTime.current = performance.now()
    
    const updateStats = () => {
      frameCount.current++
      const now = performance.now()
      
      if (now - lastTime.current >= 1000) {
        setFps(Math.round(frameCount.current * 1000 / (now - lastTime.current)))
        frameCount.current = 0
        lastTime.current = now
        
        if (performance.memory) {
          setMemory(Math.round(performance.memory.usedJSHeapSize / 1048576))
        }
      }
      
      animationId = requestAnimationFrame(updateStats)
    }
    
    animationId = requestAnimationFrame(updateStats)
    return () => cancelAnimationFrame(animationId)
  }, [isExplored])

  if (!isExplored) return null

  const bars = Array.from({ length: 20 }, (_, index) => {
    const wave = ((fps + index * 7) % 20) / 20
    const height = Math.min(100, fps * 1.25 + wave * 22)
    return {
      height,
      opacity: 0.55 + wave * 0.35,
      color: height >= 50 ? '#10B981' : height >= 30 ? '#F59E0B' : '#EF4444',
    }
  })

  return (
    <div className={`absolute z-30 ${isMobile ? 'top-12 right-2' : 'top-16 right-4'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel p-2 sm:p-3 min-w-[120px] sm:min-w-[140px]"
          >
            <div className="text-[10px] sm:text-xs text-muted-slate font-mono mb-2 flex items-center gap-1">
              <Activity size={12} sm={12} />
              {!isMobile && 'PERFORMANCE'}
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${fps >= 50 ? 'bg-plasma-green' : fps >= 30 ? 'bg-star-gold' : 'bg-red-500'}`}></span>
                  <span className="text-[10px] sm:text-xs text-muted-slate">FPS</span>
                </div>
                <span className={`text-xs sm:text-sm font-mono ${fps >= 50 ? 'text-plasma-green' : fps >= 30 ? 'text-star-gold' : 'text-red-500'}`}>
                  {fps}
                </span>
              </div>
              
              {!isMobile && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Cpu size={12} className="text-muted-slate" />
                      <span className="text-[10px] sm:text-xs text-muted-slate">Render</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-cyan-nebula">
                      Three.js
                    </span>
                  </div>
                  
                  {memory > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <HardDrive size={12} className="text-muted-slate" />
                        <span className="text-[10px] sm:text-xs text-muted-slate">Memory</span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-cosmic-violet">
                        {memory} MB
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* FPS Graph */}
            {!isMobile && (
              <div className="mt-2 sm:mt-3 h-6 sm:h-8 flex items-end gap-px">
                {bars.map((bar, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${bar.height}%`,
                      backgroundColor: bar.color,
                      opacity: bar.opacity,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center ml-auto"
      >
        <Activity size={14} sm={16} className={isOpen ? 'text-plasma-green' : 'text-muted-slate'} />
      </button>
    </div>
  )
}

export default StatsMonitor
