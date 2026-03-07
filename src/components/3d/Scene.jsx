import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import StarField from './StarField'
import CometEffects from './CometEffects'
import AboutPlanet from './AboutPlanet'
import SkillsNebula from './SkillsNebula'
import ProjectSystem from './ProjectSystem'
import ExperienceBelt from './ExperienceBelt'
import ContactStation from './ContactStation'

const cameraPositions = {
  entry: [0, 0, 20],
  about: [0, 0, 14],
  skills: [8, 0, 12],
  projects: [-6, 3, 14],
  experience: [6, -3, 14],
  contact: [-2, -4, 14]
}

export default function Scene() {
  const { camera } = useThree()
  const { currentSection, zoom } = usePortfolioStore()
  const [isMobile, setIsMobile] = useState(false)
  const targetPosition = useRef([0, 0, 20])
  const currentPos = useRef([0, 0, 20])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    targetPosition.current = cameraPositions[currentSection] || cameraPositions.entry
  }, [currentSection])

  useFrame((state, delta) => {
    const target = targetPosition.current
    const zoomOffset = zoom - 20
    
    currentPos.current = [
      currentPos.current[0] + (target[0] - currentPos.current[0]) * delta * 2,
      currentPos.current[1] + (target[1] - currentPos.current[1]) * delta * 2,
      currentPos.current[2] + ((target[2] + zoomOffset) - currentPos.current[2]) * delta * 2
    ]
    
    camera.position.set(...currentPos.current)
    camera.lookAt(0, 0, 0)
  })

  const aboutPos = isMobile ? [-2, 2, 8] : [-6, 0, 0]
  const skillsPos = isMobile ? [3, 2, -1] : [6, 0, -2]
  const experiencePos = isMobile ? [0, -3, 4] : [0, -6, 2]
  const contactPos = isMobile ? [2, 4, -3] : [3.8, 6.2, -5.2]
  const aboutScale = isMobile ? 1.2 : 2.5
  const skillsScale = isMobile ? 0.8 : 1.5
  const experienceScale = isMobile ? 0.7 : 1.2
  const contactScale = isMobile ? 0.8 : 1.3

  return (
    <>
      <StarField count={isMobile ? 2000 : 5000} />
      <CometEffects count={isMobile ? 4 : 8} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7C3AED" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06B6D4" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#F59E0B" />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        enableRotate={isMobile}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
      
      <AboutPlanet position={aboutPos} scale={aboutScale} />
      <SkillsNebula position={skillsPos} scale={skillsScale} />
      <ProjectSystem position={[0, 0, 0]} scale={1} />
      <ExperienceBelt position={experiencePos} scale={experienceScale} />
      <ContactStation position={contactPos} scale={contactScale} />
    </>
  )
}
