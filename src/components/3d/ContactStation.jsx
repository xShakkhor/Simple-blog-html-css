import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { portfolioData } from '../../data/content'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import { Send, Github, Linkedin, Mail } from 'lucide-react'
import * as THREE from 'three'

export default function ContactStation({ position, scale }) {
  const stationRef = useRef()
  const lightsRef = useRef([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const { markMissionStep } = usePortfolioStore()
  
  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
    
    lightsRef.current.forEach((light, i) => {
      if (light) {
        const phase = state.clock.elapsedTime * 2 + i
        light.material.opacity = 0.3 + Math.sin(phase) * 0.3
      }
    })
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <group position={position} scale={scale}>
      <group ref={stationRef}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 1, 1.5, 32]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        <mesh position={[0, 1, 0]}>
          <torusGeometry args={[0.9, 0.15, 16, 32]} />
          <meshStandardMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[1.2, 0.8, 0.3, 32]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2
          const x = Math.cos(angle) * 0.9
          const z = Math.sin(angle) * 0.9
          return (
            <group key={i} position={[x, 0.5, z]}>
              <mesh ref={(el) => lightsRef.current[i] = el}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial
                  color="#10B981"
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </group>
          )
        })}
        
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
      </group>
      
      <Html position={[0, -2.5, 0]} center>
        <div className="text-center">
          <span className="text-plasma-green text-sm font-mono tracking-wider">
            [ CONTACT ]
          </span>
        </div>
      </Html>
      
      <Html position={[0, 0, 2]} center>
        <button
          onClick={() => {
            setShowForm((prev) => {
              const next = !prev
              if (next) markMissionStep('contactDocked')
              return next
            })
          }}
          className="glass-panel px-6 py-3 text-text-white hover:bg-white/10 transition-colors"
        >
          {showForm ? 'Close Panel' : 'Open Transmission'}
        </button>
      </Html>
      
      {showForm && (
        <Html position={[3, 0, 0]} center>
          <div className="glass-panel p-6 w-80">
            <h3 className="text-xl font-bold text-gradient mb-4">
              Transmission Panel
            </h3>
            
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-text-white placeholder-muted-slate focus:border-cosmic-violet focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-text-white placeholder-muted-slate focus:border-cosmic-violet focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-text-white placeholder-muted-slate focus:border-cosmic-violet focus:outline-none resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-cosmic-violet/20 border border-cosmic-violet rounded-lg text-text-white hover:bg-cosmic-violet/40 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Transmission
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-plasma-green/20 flex items-center justify-center">
                  <span className="text-2xl">📡</span>
                </div>
                <p className="text-plasma-green">Signal Sent!</p>
              </div>
            )}
            
            <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-white/10">
              <a
                href={portfolioData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={portfolioData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${portfolioData.email}`}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
