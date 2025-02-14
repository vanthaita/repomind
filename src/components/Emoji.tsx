import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  emoji: string
  size: number
  velocity: { x: number; y: number }
  rotation: number
  rotationSpeed: number
}

interface Props {
  trigger: boolean
  origin?: {     
    x: number
    y: number
  }
}

const EmojiConfetti: React.FC<Props> = ({ trigger, origin }) => {
  const [isExploding, setIsExploding] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])

  const emojis = ['🎉', '🎊', '🥳', '🍾', '🎈', '🎇', '✨', '💥']

  useEffect(() => {
    if (trigger && !isExploding) {
      setIsExploding(true)
      particles.current = []
    }
  }, [trigger])

  useEffect(() => {
    if (isExploding) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const updateCanvasSize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      updateCanvasSize()
      window.addEventListener('resize', updateCanvasSize)

      const centerX = origin?.x || window.innerWidth / 2
      const centerY = origin?.y || window.innerHeight / 2
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2
        const velocity = 5 + Math.random() * 5
        particles.current.push({
          x: centerX,
          y: centerY,
          emoji: emojis[Math.floor(Math.random() * emojis.length)] as string,
          size: 20 + Math.random() * 20,
          velocity: {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
          },
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.current = particles.current.filter((particle) => {
          particle.x += particle.velocity.x
          particle.y += particle.velocity.y
          particle.velocity.y += 0.1 // Trọng lực
          particle.rotation += particle.rotationSpeed

          if (particle.y < canvas.height) {
            ctx.save()
            ctx.translate(particle.x, particle.y)
            ctx.rotate(particle.rotation)
            ctx.font = `${particle.size}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(particle.emoji, 0, 0)
            ctx.restore()
            return true
          }
          return false
        })

        if (particles.current.length > 0) {
          requestAnimationFrame(animate)
        } else {
          setIsExploding(false)
        }
      }

      animate()

      return () => {
        window.removeEventListener('resize', updateCanvasSize)
      }
    }
  }, [isExploding, origin])

  return (
    <>
      {isExploding && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: 9999 }}
        />
      )}
    </>
  )
}

export default EmojiConfetti