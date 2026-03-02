import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { usePortfolioStore } from './store/usePortfolioStore'
import Scene from './components/3d/Scene'
import HUD from './components/ui/HUD'
import EntryPortal from './components/3d/EntryPortal'

function App() {
  const { isLoaded, setIsLoaded, currentSection, isExplored } = usePortfolioStore()

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#030014']} />
        <fog attach="fog" args={['#030014', 20, 100]} />
        
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
      
      <Loader 
        containerStyles={{ background: '#030014' }}
        innerStyles={{ background: '#7C3AED', width: '200px', height: '4px' }}
        barStyles={{ background: '#7C3AED', height: '100%' }}
        dataStyles={{ color: '#F8FAFC', fontFamily: 'Space Grotesk' }}
      />
      
      {isExplored && <HUD />}
    </div>
  )
}

export default App
