import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { portfolioData } from '../../data/content'
import * as THREE from 'three'

function ParticleCluster({ position, color, skills, index }) {
  const pointsRef = useRef()
  const clusterPosition = useMemo(() => {
    const theta = (index / 5) * Math.PI * 2
    const r = 3
    return [
      position[0] + Math.cos(theta) * r,
      position[1] + Math.sin(theta) * r * 0.5,
      position[2] + Math.sin(theta) * r
    ]
  }, [position, index])
  
  const particles = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const baseColor = new THREE.Color(color)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.random() * 1.5
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)
      
      colors[i3] = baseColor.r * (0.5 + Math.random() * 0.5)
      colors[i3 + 1] = baseColor.g * (0.5 + Math.random() * 0.5)
      colors[i3 + 2] = baseColor.b * (0.5 + Math.random() * 0.5)
    }
    
    return { positions, colors }
  }, [color])
  
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
      
      const scale = hovered ? 1.5 : 1
      pointsRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      )
    }
  })

  return (
    <group position={clusterPosition}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={8}>
          <div className="glass-panel p-4 w-48 -mt-8">
            <h3 className="text-lg font-bold mb-2" style={{ color }}>
              {portfolioData.skills[index].category}
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white/10 rounded text-xs text-text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function SkillsNebula({ position, scale }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group position={position} scale={scale} ref={groupRef}>
      {portfolioData.skills.map((skillGroup, index) => (
        <ParticleCluster
          key={skillGroup.category}
          position={[0, 0, 0]}
          color={skillGroup.color}
          skills={skillGroup.skills}
          index={index}
        />
      ))}
      
      <Html position={[0, -3, 0]} center>
        <div className="text-center">
          <span className="text-cyan-nebula text-sm font-mono tracking-wider">
            [ SKILLS ]
          </span>
        </div>
      </Html>
    </group>
  )
}
