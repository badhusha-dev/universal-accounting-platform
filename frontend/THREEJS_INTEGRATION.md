# Three.js Integration Guide

This document provides comprehensive information about the Three.js animations integrated into the Universal Accounting Platform frontend.

## 🎨 Overview

The platform now features stunning 3D animations and interactive visualizations powered by Three.js, React Three Fiber, and Framer Motion. These animations enhance the user experience with smooth transitions, interactive 3D charts, and engaging loading animations.

## 🚀 Features Implemented

### 1. Animated Background
- **Component**: `AnimatedBackground.tsx`
- **Features**: 
  - Floating particles with dynamic colors
  - Animated grid with subtle rotation
  - Geometric elements (octahedron, tetrahedron)
  - Customizable intensity levels
- **Usage**: Applied globally across the application

### 2. Interactive 3D Charts
- **Component**: `ThreeDChart.tsx`
- **Chart Types**:
  - **3D Bar Charts**: Interactive bars with hover effects
  - **3D Pie Charts**: Segmented pie charts with rotation
- **Features**:
  - Real-time hover interactions
  - Data selection and highlighting
  - Smooth animations and transitions
  - Customizable colors and styling
  - Legend with interactive selection

### 3. Loading Animations
- **Component**: `LoadingAnimation.tsx`
- **Animation Types**:
  - **Spinning Cube**: Rotating cube with pulsing effect
  - **Orbiting Particles**: Circular particle animation
  - **DNA Helix**: Double helix with connecting lines
- **Features**:
  - Multiple animation styles
  - Customizable sizes (sm, md, lg)
  - Progress indicators
  - Full-screen overlay support

### 4. Page Transitions
- **Component**: `PageTransition.tsx`
- **Transition Types**:
  - **Standard Page Transition**: Smooth fade and scale
  - **Dashboard Transition**: 3D rotation effect
  - **Modal Transition**: Spring-based animation
- **Features**:
  - Automatic route-based transitions
  - Configurable easing and duration
  - 3D perspective effects

## 📁 File Structure

```
frontend/src/components/animations/
├── AnimatedBackground.tsx     # Global 3D background
├── ThreeDChart.tsx           # Interactive 3D charts
├── LoadingAnimation.tsx      # Loading animations
├── PageTransition.tsx        # Page transition effects
└── index.ts                  # Export file
```

## 🛠️ Technical Stack

### Dependencies
- **Three.js**: Core 3D graphics library
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and components
- **Framer Motion**: Animation and gesture library

### Key Technologies
- **WebGL**: Hardware-accelerated 3D graphics
- **React Hooks**: State management and lifecycle
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Styling and responsive design

## 🎯 Usage Examples

### Animated Background
```tsx
import AnimatedBackground from './components/animations/AnimatedBackground'

// Basic usage
<AnimatedBackground />

// With custom intensity
<AnimatedBackground intensity={0.5} />

// With custom styling
<AnimatedBackground 
  intensity={0.3} 
  className="fixed inset-0 -z-10" 
/>
```

### 3D Charts
```tsx
import ThreeDChart from './components/animations/ThreeDChart'

const data = [
  { label: 'Q1', value: 15000, color: '#3b82f6' },
  { label: 'Q2', value: 18000, color: '#8b5cf6' },
  { label: 'Q3', value: 22000, color: '#06b6d4' },
  { label: 'Q4', value: 25000, color: '#10b981' }
]

// 3D Bar Chart
<ThreeDChart
  data={data}
  type="bar"
  title="Quarterly Revenue"
  className="bg-gradient-to-br from-blue-900 to-purple-900"
/>

// 3D Pie Chart
<ThreeDChart
  data={data}
  type="pie"
  title="Revenue Distribution"
  className="bg-gradient-to-br from-green-900 to-emerald-900"
/>
```

### Loading Animations
```tsx
import LoadingAnimation, { LoadingOverlay } from './components/animations/LoadingAnimation'

// Inline loading
<LoadingAnimation 
  type="dna" 
  size="lg" 
  message="Loading your data..." 
/>

// Full-screen overlay
<LoadingOverlay 
  isVisible={isLoading}
  message="Processing your request..."
  type="particles"
/>
```

### Page Transitions
```tsx
import PageTransition, { DashboardTransition } from './components/animations/PageTransition'

// Standard page transition
<PageTransition>
  {children}
</PageTransition>

// Dashboard-specific transition
<DashboardTransition>
  {dashboardContent}
</DashboardTransition>
```

## 🎨 Customization

### Color Schemes
The animations use a consistent color palette:
- **Primary Blue**: `#3b82f6`
- **Purple**: `#8b5cf6`
- **Cyan**: `#06b6d4`
- **Green**: `#10b981`
- **Red**: `#ef4444`
- **Orange**: `#f59e0b`

### Animation Timing
Default animation durations:
- **Page Transitions**: 0.4-0.6s
- **Loading Animations**: 1-2s cycles
- **Chart Interactions**: 0.3s
- **Background Animations**: Continuous

### Performance Optimization
- **LOD (Level of Detail)**: Reduced complexity for distant objects
- **Instanced Rendering**: Efficient particle systems
- **Frustum Culling**: Only render visible objects
- **Texture Compression**: Optimized asset loading

## 📊 Performance Metrics

### Target Performance
- **60 FPS**: Smooth animations on modern devices
- **< 100ms**: Loading animation start time
- **< 500ms**: Chart interaction response
- **< 50MB**: Total animation assets

### Browser Support
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Optimized for touch devices

## 🔧 Development

### Adding New Animations
1. Create component in `components/animations/`
2. Use React Three Fiber for 3D elements
3. Add Framer Motion for 2D animations
4. Export from `index.ts`
5. Document usage and examples

### Performance Monitoring
```tsx
// Monitor frame rate
import { useFrame } from '@react-three/fiber'

function PerformanceMonitor() {
  useFrame((state) => {
    const fps = 1 / state.clock.getDelta()
    console.log('FPS:', fps)
  })
  return null
}
```

### Debug Mode
Enable Three.js debug helpers:
```tsx
import { OrbitControls } from '@react-three/drei'

// Add to Canvas for debugging
<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
```

## 🚀 Future Enhancements

### Planned Features
1. **VR/AR Support**: WebXR integration
2. **Physics Engine**: Cannon.js integration
3. **Particle Systems**: Advanced effects
4. **Audio Visualization**: Sound-reactive animations
5. **Gesture Controls**: Touch and mouse gestures

### Performance Improvements
1. **Web Workers**: Offload calculations
2. **Lazy Loading**: Load animations on demand
3. **Memory Management**: Better cleanup
4. **Compression**: Reduce bundle size

## 🐛 Troubleshooting

### Common Issues

#### Performance Problems
```tsx
// Reduce particle count
<FloatingParticles count={50} /> // Instead of 150

// Lower animation quality
<Canvas performance={{ min: 0.5 }}>
```

#### Memory Leaks
```tsx
// Proper cleanup in useEffect
useEffect(() => {
  return () => {
    // Dispose of Three.js objects
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

#### Mobile Performance
```tsx
// Disable animations on low-end devices
const isLowEndDevice = navigator.hardwareConcurrency < 4

if (!isLowEndDevice) {
  return <AnimatedBackground />
}
```

## 📚 Resources

### Documentation
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Drei](https://github.com/pmndrs/drei)

### Learning Resources
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Examples](https://codesandbox.io/examples/package/@react-three/fiber)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## 🎉 Conclusion

The Three.js integration transforms the Universal Accounting Platform into a visually stunning and interactive experience. The animations enhance usability while maintaining performance and accessibility standards.

For questions or contributions, please refer to the main project documentation or create an issue in the repository.
