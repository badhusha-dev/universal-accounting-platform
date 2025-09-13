import React, { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'

// Floating particles component
function FloatingParticles({ count = 100 }: { count?: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const x = (Math.random() - 0.5) * 20
        const y = (Math.random() - 0.5) * 20
        const z = (Math.random() - 0.5) * 20
        
        const hue = 0.6 + Math.random() * 0.2 // Blue to purple
        const saturation = 0.5 + Math.random() * 0.5
        const lightness = 0.3 + Math.random() * 0.4
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(hue, saturation, lightness)}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Animated grid component
function AnimatedGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.getElapsedTime()
      gridRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
      gridRef.current.rotation.z = Math.cos(time * 0.1) * 0.1
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[20, 20, '#1a1a2e', '#16213e']}
      position={[0, -2, 0]}
    />
  )
}

// Main animated background component
interface AnimatedBackgroundProps {
  className?: string
  intensity?: number
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className = '', 
  intensity = 1 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity }}
      transition={{ duration: 2 }}
      className={`fixed inset-0 -z-10 ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />
        
        {/* Scene elements */}
        <FloatingParticles count={150} />
        <AnimatedGrid />
        
        {/* Additional geometric elements */}
        <mesh position={[2, 1, -2]}>
          <octahedronGeometry args={[0.5]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} wireframe />
        </mesh>
        
        <mesh position={[-2, -1, -1]}>
          <tetrahedronGeometry args={[0.3]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} wireframe />
        </mesh>
      </Canvas>
    </motion.div>
  )
}

export default AnimatedBackground
