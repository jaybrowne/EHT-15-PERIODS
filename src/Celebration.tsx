import { useEffect, useRef } from 'react'

type Mode = 'confetti' | 'fireworks' | 'both'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  spin: number
  angle: number
  kind: 'confetti' | 'spark'
}

const colors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#8b5cf6', '#ff7ab6']
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
const modes: Mode[] = ['confetti', 'fireworks', 'both']

// Full-screen, non-interactive celebration; picks confetti, fireworks, or both at random.
export default function Celebration({ duration = 7000 }: { duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const mode = pick(modes)
    const dpr = window.devicePixelRatio || 1
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const parts: Particle[] = []
    const start = performance.now()
    let lastConfetti = 0
    let nextFirework = 0
    let raf = 0

    const burst = () => {
      const x = w * (0.15 + Math.random() * 0.7)
      const y = h * (0.12 + Math.random() * 0.4)
      const color = pick(colors)
      for (let i = 0; i < 70; i++) {
        const a = (Math.PI * 2 * i) / 70
        const s = 2 + Math.random() * 4.5
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: 2.5, color, life: 1, spin: 0, angle: 0, kind: 'spark' })
      }
    }

    const frame = (now: number) => {
      const t = now - start
      const active = t < duration * 0.75
      if (active && mode !== 'fireworks' && now - lastConfetti > 30) {
        lastConfetti = now
        for (let i = 0; i < 3; i++) {
          parts.push({
            x: Math.random() * w, y: -12, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
            size: 6 + Math.random() * 6, color: pick(colors), life: 1,
            spin: (Math.random() - 0.5) * 0.3, angle: Math.random() * Math.PI, kind: 'confetti',
          })
        }
      }
      if (active && mode !== 'confetti' && now >= nextFirework) {
        burst()
        nextFirework = now + 350 + Math.random() * 500
      }

      ctx.clearRect(0, 0, w, h)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.vx
        p.y += p.vy
        if (p.kind === 'spark') {
          p.vy += 0.06
          p.vx *= 0.985
          p.life -= 0.014
        } else {
          p.angle += p.spin
          p.vx += (Math.random() - 0.5) * 0.1
          if (p.y > h + 20) p.life = 0
        }
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.color
        if (p.kind === 'spark') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
          ctx.restore()
        }
      }
      ctx.globalAlpha = 1
      if (t < duration || parts.length) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [duration])

  return <canvas ref={ref} className="celebration" aria-hidden />
}
