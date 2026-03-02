import { useRef, useState, useEffect, useCallback } from 'react'
import { Music, Music2, Pause, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MUSIC_URL = '/music/cosmos-bg.mp3'

export function useBackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [error, setError] = useState(null)

  useEffect(() => {
    const audio = new Audio(MUSIC_URL)
    audio.loop = true
    audio.volume = volume
    audio.preload = 'auto'
    
    const handleCanPlay = () => {
      setIsLoaded(true)
      setError(null)
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {})
    }
    
    const handleError = (e) => {
      console.error('Audio load error:', e)
      setError('Failed to load music')
      setIsLoaded(false)
    }
    
    const handleEnded = () => setIsPlaying(false)
    
    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)
    
    audioRef.current = audio
    
    return () => {
      audio.pause()
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.error('Play error:', e)
          setError('Click to enable audio')
        })
    }
  }, [isPlaying])

  const setAudioVolume = useCallback((v) => {
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v
    }
  }, [])

  return {
    isPlaying,
    isLoaded,
    volume,
    error,
    togglePlay,
    setVolume: setAudioVolume
  }
}

export default function BackgroundMusic({ music }) {
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="absolute top-14 left-4 z-30">
      <AnimatePresence>
        {showControls && music.isLoaded && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-3 mb-2 w-48"
          >
            <div className="flex items-center gap-2 mb-3">
              <Music2 size={16} className="text-cosmic-violet animate-pulse" />
              <span className="text-xs text-muted-slate font-mono">BACKGROUND</span>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={music.togglePlay}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cosmic-violet/20 border border-cosmic-violet/30 rounded-lg hover:bg-cosmic-violet/40 transition-colors"
              >
                {music.isPlaying ? (
                  <>
                    <Pause size={14} />
                    <span className="text-xs">Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span className="text-xs">Play</span>
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-slate">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={music.volume}
                  onChange={(e) => music.setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cosmic-violet"
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
        className="glass-panel w-10 h-10 flex items-center justify-center hover:bg-cosmic-violet/30 transition-colors relative"
        title={music.error || "Background Music"}
      >
        {music.isPlaying ? (
          <Music2 size={18} className="text-cosmic-violet animate-pulse" />
        ) : (
          <Music size={18} className="text-muted-slate" />
        )}
        
        {music.isPlaying && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 h-2 bg-cosmic-violet rounded-full"
                animate={{ height: [4, 10, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
