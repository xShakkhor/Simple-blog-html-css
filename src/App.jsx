import { Suspense, useState, useEffect, useRef, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { usePortfolioStore } from './store/usePortfolioStore'
import Scene from './components/3d/Scene'
import HUD from './components/ui/HUD'
import SpaceRadar from './components/ui/SpaceRadar'
import StatsMonitor from './components/ui/StatsMonitor'
import ScreenshotButton from './components/ui/ScreenshotButton'
import CursorTrail from './components/ui/CursorTrail'
import BackgroundMusic from './components/ui/BackgroundMusic'
import UserInfoPanel from './components/ui/UserInfoPanel'
import EntryPortal from './components/3d/EntryPortal'

const MissionMode = lazy(() => import('./components/ui/MissionMode'))
const CopilotTerminal = lazy(() => import('./components/ui/CopilotTerminal'))
const SkillConstellationPanel = lazy(() => import('./components/ui/SkillConstellationPanel'))
const ProjectDeepZoomScene = lazy(() => import('./components/ui/ProjectDeepZoomScene'))
const UniverseEvents = lazy(() => import('./components/ui/UniverseEvents'))
import { ZoomIn, ZoomOut, RotateCcw, Volume2, VolumeX, Music, Music2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import { useSoundEffects } from './hooks/useSoundEffects'

function SignalIndicator() {
  const [showDisconnected, setShowDisconnected] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      const random = Math.random()
      if (random > 0.85) {
        setShowDisconnected(true)
        setTimeout(() => {
          setShowDisconnected(false)
        }, 150 + Math.random() * 200)
      }
    }
    
    const interval = setInterval(checkConnection, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {showDisconnected ? (
          <motion.div
            key="offline"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <span className="text-xs text-red-400 font-mono">SIGNAL LOST</span>
          </motion.div>
        ) : (
          <motion.div
            key="online"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-plasma-green"></div>
              <motion.div
                className="absolute inset-0 w-2 h-2 rounded-full bg-plasma-green"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-xs text-plasma-green font-mono">ONLINE</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Header({ soundEffects, music, cursorPreset, onToggleCursorPreset, controlsDisabled, isMobile }) {
  const { zoom, zoomIn, zoomOut, resetToEntry, isExplored } = usePortfolioStore()

  return (
    <div className="absolute top-1 left-1 right-1 z-30 px-2 py-1 flex items-center justify-between pointer-events-none rounded-t-lg bg-space-black/80">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-plasma-green animate-pulse"></div>
          <h1 className={`font-bold tracking-[0.2em] text-gradient ${isMobile ? 'text-sm' : 'text-lg'}`}>
            COSMOS
          </h1>
        </div>
        <div className={`h-4 w-px bg-gradient-to-b from-cosmic-violet/50 to-transparent ${isMobile ? 'hidden' : ''}`}></div>
        {!isMobile && <SignalIndicator />}
      </div>

      {isExplored && (
        <div className={`flex items-center gap-1 pointer-events-auto transition-opacity ${controlsDisabled ? 'opacity-35 pointer-events-none' : 'opacity-100'}`}>
          {isMobile ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => music.togglePlay()}
                className="w-8 h-8 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title={music.isPlaying ? 'Pause Music' : 'Play Music'}
              >
                {music.isPlaying ? (
                  <Music2 size={14} className="text-cosmic-violet animate-pulse" />
                ) : (
                  <Music size={14} className="text-muted-slate" />
                )}
              </button>
              <button
                onClick={() => soundEffects.toggleMute()}
                className="w-8 h-8 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title={soundEffects.isMuted ? 'Unmute' : 'Mute'}
              >
                {soundEffects.isMuted ? (
                  <VolumeX size={14} className="text-text-white" />
                ) : (
                  <Volume2 size={14} className="text-text-white" />
                )}
              </button>
              <button
                onClick={() => soundEffects.playClick() || zoomIn()}
                className="w-8 h-8 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title="Zoom In"
              >
                <ZoomIn size={14} className="text-text-white" />
              </button>
              <button
                onClick={() => soundEffects.playClick() || zoomOut()}
                className="w-8 h-8 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={14} className="text-text-white" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 glass-panel px-2 py-1">
                <button
                  onClick={() => music.togglePlay()}
                  className="flex items-center justify-center hover:text-cosmic-violet transition-colors"
                  title={music.isPlaying ? 'Pause Music' : 'Play Music'}
                >
                  {music.isPlaying ? (
                    <Music2 size={13} className="text-cosmic-violet animate-pulse" />
                  ) : (
                    <Music size={13} className="text-muted-slate" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={music.volume}
                  onChange={(e) => music.setVolume(parseFloat(e.target.value))}
                  className="w-10 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cosmic-violet"
                  title={`Volume: ${Math.round(music.volume * 100)}%`}
                />
                <span className="text-xs text-cyan-nebula font-mono w-6">
                  {Math.round(music.volume * 100)}%
                </span>
              </div>
              
              <button
                onClick={() => {
                  soundEffects.toggleMute()
                  soundEffects.playClick()
                }}
                className="w-7 h-7 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title={soundEffects.isMuted ? 'Unmute' : 'Mute'}
              >
                {soundEffects.isMuted ? (
                  <VolumeX size={14} className="text-text-white" />
                ) : (
                  <Volume2 size={14} className="text-text-white" />
                )}
              </button>

              <div className="glass-panel px-2 py-1 flex items-center gap-1">
                <span className="text-xs text-muted-slate font-mono">ZM</span>
                <span className="text-xs text-cyan-nebula font-mono w-5 text-center">{zoom.toFixed(0)}</span>
              </div>
              <button
                onClick={() => soundEffects.playClick() || zoomIn()}
                className="w-7 h-7 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title="Zoom In"
              >
                <ZoomIn size={14} className="text-text-white" />
              </button>
              <button
                onClick={() => soundEffects.playClick() || zoomOut()}
                className="w-7 h-7 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={14} className="text-text-white" />
              </button>
              <button
                onClick={() => soundEffects.playWarp() || resetToEntry()}
                className="w-7 h-7 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all"
                title="Reset View"
              >
                <RotateCcw size={12} className="text-text-white" />
              </button>
              <button
                onClick={onToggleCursorPreset}
                className="glass-panel px-2 py-1 text-[10px] font-mono text-cyan-nebula hover:bg-cosmic-violet/30 transition-all"
                title="Toggle cursor preset"
              >
                CURSOR {cursorPreset === 'intense' ? 'INTENSE' : 'SUBTLE'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function App() {
  const { setIsLoaded, isExplored } = usePortfolioStore()
  const [isMobile, setIsMobile] = useState(false)
  const wheelTimeout = useRef(null)
  const soundEffects = useSoundEffects()
  const backgroundMusic = useBackgroundMusic()
  const [firstClick, setFirstClick] = useState(false)
  const [cursorPreset, setCursorPreset] = useState('intense')
  const [activeEvent, setActiveEvent] = useState(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isExplored) return
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
      
      const { zoomIn, zoomOut } = usePortfolioStore.getState()
      if (e.deltaY < 0) zoomIn()
      else zoomOut()
      
      wheelTimeout.current = setTimeout(() => {}, 100)
    }
    
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
    }
  }, [isExplored])

  useEffect(() => {
    const handleFirstClick = () => {
      if (!firstClick && backgroundMusic.isLoaded) {
        backgroundMusic.togglePlay()
        setFirstClick(true)
      }
    }
    document.addEventListener('click', handleFirstClick, { once: true })
    return () => document.removeEventListener('click', handleFirstClick)
  }, [firstClick, backgroundMusic])

  const handleToggleCursorPreset = () => {
    setCursorPreset((prev) => (prev === 'intense' ? 'subtle' : 'intense'))
  }

  const isBlackout = activeEvent === 'comms-blackout'
  const isFlare = activeEvent === 'solar-flare'
  const isMeteorShake = activeEvent === 'meteor-shower'

  return (
    <div className="w-full h-full relative flex items-center justify-center p-1 sm:p-2">
      <div className={`relative w-full h-full ${isMobile ? '' : 'max-w-[1400px] max-h-[800px]'} ${isMeteorShake ? 'animate-camera-shake' : ''}`}>
        <div className={`absolute inset-0 rounded-lg sm:rounded-xl border border-cosmic-violet/40 pointer-events-none z-20 transition-all ${isFlare ? 'shadow-[0_0_34px_rgba(245,158,11,0.65),inset_0_0_28px_rgba(245,158,11,0.35)]' : 'shadow-[0_0_20px_rgba(124,58,237,0.4),inset_0_0_20px_rgba(124,58,237,0.15)]'}`}></div>
        <div className="absolute inset-[2px] sm:inset-[3px] rounded-lg border border-cyan-nebula/30 shadow-[0_0_15px_rgba(6,182,212,0.25)] pointer-events-none z-20"></div>
        <div className="absolute top-0 left-0 w-3 h-3 sm:w-5 sm:h-5 border-l border-t border-cosmic-violet rounded-tl z-20"></div>
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-5 sm:h-5 border-r border-t border-cosmic-violet rounded-tr z-20"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-5 sm:h-5 border-l border-b border-cosmic-violet rounded-bl z-20"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-5 sm:h-5 border-r border-b border-cosmic-violet rounded-br z-20"></div>
        
        <Header
          soundEffects={soundEffects}
          music={backgroundMusic}
          cursorPreset={cursorPreset}
          onToggleCursorPreset={handleToggleCursorPreset}
          controlsDisabled={isBlackout}
          isMobile={isMobile}
        />
        
        <div className={`absolute inset-0 rounded-xl overflow-hidden bg-space-black transition-all ${isFlare ? 'saturate-150 brightness-110' : ''}`}>
          <Canvas
            camera={{ position: [0, 0, 20], fov: isMobile ? 50 : 60 }}
            dpr={[1, isMobile ? 1.5 : 2]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={['#030014']} />
            <fog attach="fog" args={['#030014', 15, 80]} />
            
            <Suspense fallback={null}>
              {!isExplored ? (
                <EntryPortal onComplete={() => {
                  soundEffects.playWarp()
                  setIsLoaded(true)
                }} />
              ) : (
                <Scene />
              )}
            </Suspense>
          </Canvas>
        </div>
        
        {isMobile && isExplored && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs text-muted-slate/50 z-20">
            Pinch to zoom • Drag to rotate
          </div>
        )}
        
        <Loader 
          containerStyles={{ background: '#030014' }}
          innerStyles={{ background: '#7C3AED', width: '200px', height: '4px' }}
          barStyles={{ background: '#7C3AED', height: '100%' }}
          dataStyles={{ color: '#F8FAFC', fontFamily: 'Space Grotesk' }}
        />
        
        {isExplored && !isBlackout && <HUD />}
        {!isBlackout && (
          <Suspense fallback={null}>
            <MissionMode />
            <CopilotTerminal />
            <SkillConstellationPanel />
            <BackgroundMusic music={backgroundMusic} />
          </Suspense>
        )}
        {!isBlackout && <SpaceRadar />}
        {!isBlackout && <StatsMonitor />}
        {!isBlackout && <ScreenshotButton />}
        {!isBlackout && <UserInfoPanel />}
        <Suspense fallback={null}>
          <UniverseEvents onEventChange={setActiveEvent} />
          <ProjectDeepZoomScene />
        </Suspense>
      </div>
      <CursorTrail preset={cursorPreset} />
    </div>
  )
}

export default App
