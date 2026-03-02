import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { usePortfolioStore } from './store/usePortfolioStore'
import Scene from './components/3d/Scene'
import HUD from './components/ui/HUD'
import EntryPortal from './components/3d/EntryPortal'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

function CameraController({ zoom, setZoom }) {
  const { camera } = useThree()
  const targetZoom = useRef(20)
  
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      targetZoom.current = Math.max(5, Math.min(40, targetZoom.current + e.deltaY * 0.01))
      setZoom(targetZoom.current)
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [setZoom])
  
  useFrame(() => {
    camera.position.z += (targetZoom.current - camera.position.z) * 0.1
  })
  
  return null
}

function App() {
  const { isLoaded, setIsLoaded, currentSection, isExplored } = usePortfolioStore()
  const [zoom, setZoom] = useState(20)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleZoomIn = () => {
    setZoom(prev => Math.max(5, prev - 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.min(40, prev + 3))
  }

  const handleReset = () => {
    setZoom(20)
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center p-4">
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
            
            <CameraController zoom={zoom} setZoom={setZoom} />
            
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
        
        {/* Zoom Controls */}
        {isExplored && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} className="text-text-white" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} className="text-text-white" />
            </button>
            <button
              onClick={handleReset}
              className="w-10 h-10 glass-panel flex items-center justify-center hover:bg-cosmic-violet/30 transition-colors"
              title="Reset View"
            >
              <RotateCcw size={18} className="text-text-white" />
            </button>
          </div>
        )}
        
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
