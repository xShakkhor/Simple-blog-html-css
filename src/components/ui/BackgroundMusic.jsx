import { Music, Music2, Pause, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function BackgroundMusic({ music }) {
  const [showControls, setShowControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className={`absolute z-30 ${isMobile ? 'top-12 right-2' : 'top-14 left-4'}`}>
      <AnimatePresence>
        {showControls && music.isLoaded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel mb-2 w-48 sm:w-56 p-2 sm:p-3"
          >
            <div className="mb-2 sm:mb-3 flex items-center gap-2">
              <Music2 size={14} sm={16} className="animate-pulse text-cosmic-violet" />
              <span className="font-mono text-[10px] sm:text-xs text-muted-slate">BACKGROUND</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={music.togglePlay}
                className="flex w-full items-center justify-center gap-2 rounded-lg sm:rounded-xl border border-cosmic-violet/30 bg-cosmic-violet/20 px-2 sm:px-3 py-1.5 sm:py-2 transition-colors hover:bg-cosmic-violet/40"
              >
                {music.isPlaying ? (
                  <>
                    <Pause size={12} sm={14} />
                    <span className="text-[10px] sm:text-xs">Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={12} sm={14} />
                    <span className="text-[10px] sm:text-xs">Play</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 rounded-lg sm:rounded-xl border border-white/8 bg-space-black/35 px-2 py-1.5 sm:py-2">
                <span className="text-[10px] sm:text-xs text-muted-slate">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={music.volume}
                  onChange={(event) => music.setVolume(parseFloat(event.target.value))}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-white/20 accent-cosmic-violet"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setShowControls(!showControls)
          music.togglePlay()
        }}
        className="glass-panel relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center transition-colors hover:bg-cosmic-violet/20"
        title={music.error || 'Background Music'}
      >
        {music.isPlaying ? (
          <Music2 size={16} sm={18} className="animate-pulse text-cosmic-violet" />
        ) : (
          <Music size={16} sm={18} className="text-muted-slate" />
        )}

        {music.isPlaying && (
          <motion.div
            className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="h-2 w-0.5 rounded-full bg-cosmic-violet"
                animate={{ height: [4, 10, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: index * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
