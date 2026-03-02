import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { usePortfolioStore } from './store/usePortfolioStore'
import Scene from './components/3d/Scene'
import HUD from './components/ui/HUD'
import EntryPortal from './components/3d/EntryPortal'
import { ZoomIn, ZoomOut, RotateCcw, Wifi, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function SignalIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showDisconnected, setShowDisconnected] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      const random = Math.random()
      if (random > 0.85) {
        setIsOnline(false)
        setShowDisconnected(true)
        setTimeout(() => {
          setIsOnline(true)
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
            <WifiOff size={14} className="text-red-500" />
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

function Header() {
  const { zoom, zoomIn, zoomOut, resetToEntry, isExplored } = usePortfolioStore()

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 py-3">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-plasma-green animate-pulse"></div>
            <h1 className="text-2xl font-bold tracking-[0.3em] text-gradient">
              COSMOS
            </h1>
          </div>
          <div className="h-6 w-px bg-gradient-to-b from-cosmic-violet/50 to-transparent"></div>
          <SignalIndicator />
        </div>

        {/* Controls Section */}
        {isExplored && (
          <div className="flex items-center gap-3">
            <div className="glass-panel px-3 py-1.5 flex items-center gap-2">
              <span className="text-xs text-muted-slate font-mono">ZOOM</span>
              <span className="text-xs text-cyan-nebula font-mono w-8 text-center">{zoom.toFixed(0)}x</span>
            </div>
            <button
              onClick={zoomIn}
              className="w-9 h-9 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all hover:scale-110"
              title="Zoom In"
            >
              <ZoomIn size={18} className="text-text-white" />
            </button>
            <button
              onClick={zoomOut}
              className="w-9 h-9 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all hover:scale-110"
              title="Zoom Out"
            >
              <ZoomOut size={18} className="text-text-white" />
            </button>
            <button
              onClick={resetToEntry}
              className="w-9 h-9 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-all hover:scale-110"
              title="Reset View"
            >
              <RotateCcw size={16} className="text-text-white" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function App() {
  const { isLoaded, setIsLoaded, currentSection, isExplored } = usePortfolioStore()
  const [isMobile, setIsMobile] = useState(false)
  const wheelTimeout = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isExplored) return
      
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
      
      const { zoomIn, zoomOut } = usePortfolioStore.getState()
      
      if (e.deltaY < 0) {
        zoomIn()
      } else {
        zoomOut()
      }
      
      wheelTimeout.current = setTimeout(() => {}, 100)
    }
    
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
    }
  }, [isExplored])

  return (
    <div className="w-full h-full relative flex items-center justify-center p-4 pt-16 pb-20">
      <Header />
      
      {/* Beautiful border frame */}
      <div className="relative w-full h-full max-w-[1800px] max-h-[1000px]">
        {/* Outer decorative border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-cosmic-violet/30 shadow-[0_0_30px_rgba(124,58,237,0.3),inset_0_0_30px_rgba(124,58,237,0.1)] pointer-events-none z-20"></div>
        
        {/* Inner glow border */}
        <div className="absolute inset-2 rounded-xl border border-cyan-nebula/20 shadow-[0_0_20px_rgba(6,182,212,0.2)] pointer-events-none z-20"></div>
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cosmic-violet rounded-tl-lg z-20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cosmic-violet rounded-tr-lg z-20"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cosmic-violet rounded-bl-lg z-20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cosmic-violet rounded-br-lg z-20"></div>
        
        {/* Canvas container */}
        <div className="absolute inset-0 rounded-xl overflow-hidden bg-space-black">
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
                  setIsLoaded(true)
                }} />
              ) : (
                <Scene />
              )}
            </Suspense>
          </Canvas>
        </div>
        
        {/* Mobile hint */}
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
        
        {isExplored && <HUD />}
      </div>
    </div>
  )
}

export default App
