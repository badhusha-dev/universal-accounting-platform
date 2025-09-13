import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Spinning cube loading animation
function SpinningCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial
        color="#3b82f6"
        transparent
        opacity={0.8}
        shininess={100}
      />
    </mesh>
  )
}

// Orbiting particles loading animation
function OrbitingParticles() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial
              color={`hsl(${i * 45}, 70%, 60%)`}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// DNA helix loading animation
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }, (_, i) => {
        const t = i / 20
        const x = Math.cos(t * Math.PI * 4) * 0.5
        const y = (t - 0.5) * 4
        const z = Math.sin(t * Math.PI * 4) * 0.5
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}
      
      {/* Connecting lines */}
      {Array.from({ length: 19 }, (_, i) => {
        const t1 = i / 20
        const t2 = (i + 1) / 20
        const x1 = Math.cos(t1 * Math.PI * 4) * 0.5
        const y1 = (t1 - 0.5) * 4
        const z1 = Math.sin(t1 * Math.PI * 4) * 0.5
        const x2 = Math.cos(t2 * Math.PI * 4) * 0.5
        const y2 = (t2 - 0.5) * 4
        const z2 = Math.sin(t2 * Math.PI * 4) * 0.5
        
        const points = [
          new THREE.Vector3(x1, y1, z1),
          new THREE.Vector3(x2, y2, z2)
        ]
        
        return (
          <line key={`line-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#64748b" transparent opacity={0.3} />
          </line>
        )
      })}
    </group>
  )
}

// Main loading animation component
interface LoadingAnimationProps {
  type?: 'cube' | 'particles' | 'dna'
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  type = 'cube',
  size = 'md',
  message = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const renderAnimation = () => {
    switch (type) {
      case 'particles':
        return <OrbitingParticles />
      case 'dna':
        return <DNAHelix />
      default:
        return <SpinningCube />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <div className={`${sizeClasses[size]} mb-4`}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          {renderAnimation()}
        </Canvas>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-300 text-sm font-medium"
      >
        {message}
      </motion.p>
      
      {/* Progress dots */}
      <motion.div className="flex gap-1 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

// Full screen loading overlay
interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  type?: 'cube' | 'particles' | 'dna'
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Loading your data...',
  type = 'dna'
}) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl"
      >
        <LoadingAnimation type={type} size="lg" message={message} />
      </motion.div>
    </motion.div>
  )
}

export default LoadingAnimation
