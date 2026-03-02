import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import StarField from './StarField'
import AboutPlanet from './AboutPlanet'
import SkillsNebula from './SkillsNebula'
import ProjectSystem from './ProjectSystem'
import ExperienceBelt from './ExperienceBelt'
import ContactStation from './ContactStation'

const cameraPositions = {
  entry: [0, 0, 20],
  about: [0, 0, 8],
  skills: [15, 0, 8],
  projects: [-10, 5, 10],
  experience: [10, -5, 10],
  contact: [0, -8, 8]
}

export default function Scene() {
  const { camera } = useThree()
  const { currentSection, cameraPosition } = usePortfolioStore()
  const targetPosition = useRef([0, 0, 20])
  const currentPos = useRef([0, 0, 20])

  useEffect(() => {
    targetPosition.current = cameraPositions[currentSection] || cameraPositions.entry
  }, [currentSection])

  useFrame((state, delta) => {
    const target = targetPosition.current
    
    currentPos.current = [
      currentPos.current[0] + (target[0] - currentPos.current[0]) * delta * 2,
      currentPos.current[1] + (target[1] - currentPos.current[1]) * delta * 2,
      currentPos.current[2] + (target[2] - currentPos.current[2]) * delta * 2
    ]
    
    camera.position.set(...currentPos.current)
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <StarField />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7C3AED" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06B6D4" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#F59E0B" />
      
      <AboutPlanet position={[-6, 0, 0]} scale={2.5} />
      <SkillsNebula position={[6, 0, -2]} scale={1.5} />
      <ProjectSystem position={[0, 0, 0]} scale={1} />
      <ExperienceBelt position={[0, -6, 2]} scale={1.2} />
      <ContactStation position={[0, 6, -2]} scale={1.3} />
    </>
  )
}
