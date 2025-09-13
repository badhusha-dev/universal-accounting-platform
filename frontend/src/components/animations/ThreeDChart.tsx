import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// Removed OrbitControls due to compatibility issues
import * as THREE from 'three'
import { motion } from 'framer-motion'

// 3D Bar component for chart data
interface BarData {
  value: number
  label: string
  color: string
  x: number
  z: number
}

interface BarProps {
  data: BarData
  isHovered: boolean
  onHover: (hovered: boolean) => void
}

const Bar: React.FC<BarProps> = ({ data, isHovered, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle animation
      meshRef.current.position.y = data.value / 2 + Math.sin(state.clock.getElapsedTime() + data.x) * 0.1
      
      // Hover effect
      if (hover || isHovered) {
        meshRef.current.scale.setScalar(1.1)
        if (meshRef.current.material instanceof THREE.Material) {
          (meshRef.current.material as any).opacity = 0.9
        }
      } else {
        meshRef.current.scale.setScalar(1)
        if (meshRef.current.material instanceof THREE.Material) {
          (meshRef.current.material as any).opacity = 0.7
        }
      }
    }
  })

  return (
    <group position={[data.x, 0, data.z]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          setHover(true)
          onHover(true)
        }}
        onPointerOut={() => {
          setHover(false)
          onHover(false)
        }}
      >
        <boxGeometry args={[0.8, data.value, 0.8]} />
        <meshPhongMaterial
          color={data.color}
          transparent
          opacity={0.7}
          shininess={100}
        />
      </mesh>
      
      {/* Value label - using simple HTML overlay instead */}
      <mesh position={[0, data.value + 0.5, 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// 3D Pie chart component
interface PieData {
  value: number
  label: string
  color: string
}

interface PieSegmentProps {
  data: PieData
  startAngle: number
  endAngle: number
  radius: number
  isHovered: boolean
  onHover: (hovered: boolean) => void
}

const PieSegment: React.FC<PieSegmentProps> = ({ 
  data, 
  startAngle, 
  endAngle, 
  radius, 
  isHovered, 
  onHover 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)
  
  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    
    shape.moveTo(0, 0)
    shape.lineTo(Math.cos(startAngle) * radius, Math.sin(startAngle) * radius)
    shape.absarc(0, 0, radius, startAngle, endAngle, false)
    shape.lineTo(0, 0)
    
    return shape
  }, [startAngle, endAngle, radius])

  useFrame(() => {
    if (meshRef.current) {
      if (hover || isHovered) {
        meshRef.current.scale.setScalar(1.1)
        meshRef.current.position.z = 0.2
      } else {
        meshRef.current.scale.setScalar(1)
        meshRef.current.position.z = 0
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => {
        setHover(true)
        onHover(true)
      }}
      onPointerOut={() => {
        setHover(false)
        onHover(false)
      }}
    >
      <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05 }]} />
      <meshPhongMaterial color={data.color} shininess={100} />
    </mesh>
  )
}

// Main 3D Chart component
interface ThreeDChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  type: 'bar' | 'pie'
  title?: string
  className?: string
}

const ThreeDChart: React.FC<ThreeDChartProps> = ({ 
  data, 
  type, 
  title = '3D Chart',
  className = ''
}) => {
  const [hoveredData, setHoveredData] = useState<string | null>(null)
  const [selectedData, setSelectedData] = useState<string | null>(null)

  const processedData = useMemo(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    
    return data.map((item, index) => ({
      ...item,
      color: item.color || colors[index % colors.length],
      x: type === 'bar' ? (index - data.length / 2) * 1.5 : 0,
      z: type === 'bar' ? 0 : 0
    }))
  }, [data, type])

  const totalValue = useMemo(() => 
    data.reduce((sum, item) => sum + item.value, 0), 
    [data]
  )

  const pieAngles = useMemo(() => {
    if (type !== 'pie') return []
    
    let currentAngle = 0
    return data.map((item) => {
      const startAngle = currentAngle
      const endAngle = currentAngle + (item.value / totalValue) * Math.PI * 2
      currentAngle = endAngle
      return { startAngle, endAngle }
    })
  }, [data, type, totalValue])

  const handleDataHover = (label: string, hovered: boolean) => {
    setHoveredData(hovered ? label : null)
  }

  const handleDataClick = (label: string) => {
    setSelectedData(selectedData === label ? null : label)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gray-900 rounded-lg p-6 ${className}`}
    >
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      
      <div className="h-96 w-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#3b82f6" />
          
          {type === 'bar' ? (
            <group>
              {processedData.map((item) => (
                <Bar
                  key={item.label}
                  data={item as BarData}
                  isHovered={hoveredData === item.label}
                  onHover={(hovered) => handleDataHover(item.label, hovered)}
                />
              ))}
            </group>
          ) : (
            <group>
              {processedData.map((item, index) => (
                <PieSegment
                  key={item.label}
                  data={item as PieData}
                  startAngle={pieAngles[index].startAngle}
                  endAngle={pieAngles[index].endAngle}
                  radius={2}
                  isHovered={hoveredData === item.label}
                  onHover={(hovered) => handleDataHover(item.label, hovered)}
                />
              ))}
            </group>
          )}
          
          {/* OrbitControls removed due to compatibility issues */}
        </Canvas>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {processedData.map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
              selectedData === item.label 
                ? 'bg-white text-gray-900' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            onClick={() => handleDataClick(item.label)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
            <span className="text-gray-400">({item.value})</span>
          </motion.div>
        ))}
      </div>
      
      {/* Hover info */}
      {hoveredData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gray-800 rounded-lg"
        >
          <p className="text-white">
            <span className="font-semibold">{hoveredData}</span>: {
              processedData.find(d => d.label === hoveredData)?.value
            }
            {type === 'pie' && (
              <span className="text-gray-400 ml-2">
                ({((processedData.find(d => d.label === hoveredData)?.value || 0) / totalValue * 100).toFixed(1)}%)
              </span>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ThreeDChart
