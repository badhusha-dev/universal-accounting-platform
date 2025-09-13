import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Specific transition for dashboard pages
export const DashboardTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()

  const dashboardVariants = {
    initial: {
      opacity: 0,
      x: 30,
      rotateY: 15
    },
    in: {
      opacity: 1,
      x: 0,
      rotateY: 0
    },
    out: {
      opacity: 0,
      x: -30,
      rotateY: -15
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={dashboardVariants}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.5
        }}
        className="w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Transition for modal-like components
export const ModalTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
