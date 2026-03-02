import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { portfolioData } from '../../data/content'
import * as THREE from 'three'

function Asteroid({ position, size, experience, index }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [showCard, setShowCard] = useState(false)
  
  const rotationSpeed = 0.01 + Math.random() * 0.02
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed
      meshRef.current.rotation.y += rotationSpeed * 0.7
      
      if (hovered) {
        meshRef.current.material.emissive.lerp(
          new THREE.Color('#F59E0B'),
          0.1
        )
        meshRef.current.material.emissiveIntensity = 0.5
      } else {
        meshRef.current.material.emissiveIntensity = 0.1
      }
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setShowCard(!showCard)}
      >
        <dodecahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color="#64748B"
          emissive="#7C3AED"
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {showCard && (
        <Html position={[0, size + 0.5, 0]} center>
          <div className="glass-panel p-4 w-64 -mt-16">
            <h3 className="text-lg font-bold text-text-white mb-1">
              {experience.role}
            </h3>
            <p className="text-sm text-cosmic-violet mb-2">
              {experience.company}
            </p>
            <p className="text-xs text-muted-slate mb-3">
              {experience.period}
            </p>
            
            <ul className="text-xs text-muted-slate mb-3 space-y-1">
              {experience.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-star-gold">▸</span>
                  {achievement}
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-1">
              {experience.stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-cosmic-violet/20 text-cosmic-violet text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ExperienceBelt({ position, scale }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  const asteroids = portfolioData.experience.map((exp, index) => {
    const angle = (index / portfolioData.experience.length) * Math.PI * 2
    const radius = 4
    return {
      position: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.3,
        Math.sin(angle) * radius
      ],
      size: 0.3 + (exp.achievements.length * 0.1),
      experience: exp,
      index
    }
  })

  return (
    <group position={position} scale={scale} ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 4.5, 64]} />
        <meshBasicMaterial
          color="#7C3AED"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {asteroids.map((asteroid, index) => (
        <Asteroid
          key={asteroid.experience.id}
          position={asteroid.position}
          size={asteroid.size}
          experience={asteroid.experience}
          index={index}
        />
      ))}
      
      <Html position={[0, -2.5, 0]} center>
        <div className="text-center">
          <span className="text-cosmic-violet text-sm font-mono tracking-wider">
            [ EXPERIENCE ]
          </span>
        </div>
      </Html>
    </group>
  )
}
