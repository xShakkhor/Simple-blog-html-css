import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { portfolioData } from '../../data/content'
import * as THREE from 'three'

function ProjectMoon({ project, index, total }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  const orbitRadius = 4 + (index % 3) * 1.5
  const orbitSpeed = 0.2 + index * 0.05
  const orbitOffset = (index / total) * Math.PI * 2
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * orbitSpeed + orbitOffset
      meshRef.current.position.x = Math.cos(t) * orbitRadius
      meshRef.current.position.z = Math.sin(t) * orbitRadius
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.5
      
      meshRef.current.rotation.y += 0.02
      
      const scale = hovered ? 1.3 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      )
    }
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setShowDetails(!showDetails)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {hovered && (
        <Html position={[meshRef.current?.position.x || 0, 0.8, meshRef.current?.position.z || 0]}>
          <div className="glass-panel px-3 py-2 -mt-8">
            <span className="text-sm font-medium text-text-white">
              {project.title}
            </span>
          </div>
        </Html>
      )}
      
      {showDetails && (
        <Html position={[meshRef.current?.position.x || 0, 0, meshRef.current?.position.z || 0]}>
          <div className="glass-panel p-4 w-64 -ml-32 -mt-32">
            <h3 className="text-lg font-bold mb-2" style={{ color: project.color }}>
              {project.title}
            </h3>
            
            <p className="text-muted-slate text-xs mb-3 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-xs text-text-white"
                  style={{ backgroundColor: `${project.color}30`, border: `1px solid ${project.color}50` }}
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-plasma-green/20 text-plasma-green text-xs rounded border border-plasma-green/30 hover:bg-plasma-green/40 transition-colors"
              >
                Live Demo
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-cosmic-violet/20 text-cosmic-violet text-xs rounded border border-cosmic-violet/30 hover:bg-cosmic-violet/40 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ProjectSystem({ position, scale }) {
  const starRef = useRef()

  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group position={position} scale={scale}>
      <mesh ref={starRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#F59E0B"
        distance={15}
      />
      
      {portfolioData.projects.map((project, index) => (
        <ProjectMoon
          key={project.id}
          project={project}
          index={index}
          total={portfolioData.projects.length}
        />
      ))}
      
      <Html position={[0, 3, 0]} center>
        <div className="text-center">
          <span className="text-star-gold text-sm font-mono tracking-wider">
            [ PROJECTS ]
          </span>
        </div>
      </Html>
    </group>
  )
}
