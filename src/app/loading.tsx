'use client'
import { motion } from 'framer-motion'
import {LogoText } from '@/components/ui/logo'

export default function RippleLoader() {
  const rippleVariants = {
    start: {
      opacity: 1,
      scale: 0,
    },
    end: {
      opacity: 0,
      scale: 3,
    },
  }

  const rippleTransition = {
    duration: 2,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatDelay: 1,
  }

  return (
    <div className="flex items-center justify-center h-screen fixed bg-black inset-0 z-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
             
              <motion.div
                className="absolute inset-0 rounded-xl bg-green-500/20"
                variants={rippleVariants}
                initial="start"
                animate="end"
                transition={rippleTransition}
              />
              <motion.div
                className="absolute inset-0 rounded-xl bg-green-500/10"
                variants={rippleVariants}
                initial="start"
                animate="end"
                transition={{ ...rippleTransition, delay: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 rounded-xl bg-green-500/5"
                variants={rippleVariants}
                initial="start"
                animate="end"
                transition={{ ...rippleTransition, delay: 1 }}
              />
            </div>
          </div>
          <div className="mb-4">
            <LogoText size="lg" />
          </div>
          <div className="flex items-center justify-center space-x-1">
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
        <p className="text-gray-400 text-lg font-medium">Initializing RepoMind...</p>
      </div>
    </div>
  )
}