import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { periods } from '../data'
import { useLocalStorage } from '../hooks'

type Mode = 'full' | 'rhyme' | 'image'

const modes: { id: Mode; label: string }[] = [
  { id: 'full', label: 'Full' },
  { id: 'rhyme', label: 'Rhyme' },
  { id: 'image', label: 'Image Only' },
]

export default function MemoryMap() {
  const [mode, setMode] = useLocalStorage<Mode>('eht15.mapMode', 'full')
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const toggle = (n: number) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      if (!next.delete(n)) next.add(n)
      return next
    })

  const changeMode = (m: Mode) => {
    setMode(m)
    setRevealed(new Set())
  }

  return (
    <section className="map">
      <div className="toolbar">
        <div className="segmented" role="radiogroup" aria-label="Display mode">
          {modes.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={mode === m.id}
              className={mode === m.id ? 'on' : ''}
              onClick={() => changeMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode !== 'full' && (
          <div className="toolbar-actions">
            <button className="ghost" onClick={() => setRevealed(new Set(periods.map((p) => p.number)))}>
              <Eye size={16} aria-hidden /> Reveal All
            </button>
            <button className="ghost" onClick={() => setRevealed(new Set())}>
              <EyeOff size={16} aria-hidden /> Hide All
            </button>
          </div>
        )}
      </div>

      <ul className="grid">
        {periods.map((p) => {
          const open = revealed.has(p.number)
          const showRhyme = mode !== 'image' || open
          const showName = mode === 'full' || open
          const canReveal = mode !== 'full'
          return (
            <li key={p.number} className={`card ${p.testament}`}>
              <Link
                to={`/learn/${p.number}`}
                className="card-link"
                aria-label={`Open period ${p.number}${showRhyme ? `, ${p.rhyme}` : ''}${showName ? `, ${p.name}` : ''}`}
              >
                <div className="thumb">
                  <img src={p.image} alt="" loading="lazy" />
                  <span className="badge">{p.number}</span>
                </div>
                <div className="labels">
                  <strong className="rhyme">{showRhyme ? p.rhyme : '?'}</strong>
                  <span className="name">{showName ? p.name : '\u00a0'}</span>
                </div>
              </Link>
              {canReveal && (
                <button
                  className="reveal"
                  onClick={() => toggle(p.number)}
                  aria-pressed={open}
                  aria-label={`${open ? 'Hide' : 'Reveal'} answer for period ${p.number}`}
                  title={open ? 'Hide' : 'Reveal'}
                >
                  {open ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <div className="legend" aria-hidden>
        <span className="dot ot" /> Old Testament <span className="dot between" /> Between <span className="dot nt" /> New Testament
      </div>
    </section>
  )
}
