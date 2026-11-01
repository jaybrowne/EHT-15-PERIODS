import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { periods } from '../data'

// Short teaching sub-labels shown on each card (supplemental to the source data).
const details: Record<number, string> = {
  1: '',
  2: '',
  3: 'Abraham, Isaac, Jacob',
  4: 'Egypt',
  5: 'Wandering',
  6: 'Canaan',
  7: '',
  8: 'Saul, David, Solomon',
  9: 'Israel & Judah',
  10: '',
  11: 'Babylon',
  12: 'Restoration',
  13: '',
  14: '',
  15: '',
}

const nameOverrides: Record<number, string> = { 13: 'Between Testaments' }

// `at` is a position in period columns: 0 = left edge of period 1, 15 = right edge of period 15.
const timeline: { at: number; date: string; note?: [string, string]; icon?: 'mountain' | 'cross' }[] = [
  { at: 0, date: '4000 BC' },
  { at: 4, date: '1500 BC', note: ['Mt. Sinai', '(Law of Moses)'], icon: 'mountain' },
  { at: 7, date: '1000 BC' },
  { at: 9, date: '722 BC' },
  { at: 10, date: '606 BC' },
  { at: 11, date: '536 BC' },
  { at: 12, date: '400 BC' },
  { at: 14, date: '33 AD', icon: 'cross' },
  { at: 14.85, date: 'Now' },
]

const Mountain = () => (
  <span className="tl-art mountain" aria-hidden>
    <span className="tl-rays" />
    <svg viewBox="0 0 100 70">
      <defs>
        <linearGradient id="mtL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#d98a2b" />
        </linearGradient>
        <linearGradient id="mtR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9a443" />
          <stop offset="1" stopColor="#a35a14" />
        </linearGradient>
      </defs>
      <polygon points="0,68 24,34 46,68" fill="url(#mtR)" />
      <polygon points="58,68 82,28 100,68" fill="url(#mtR)" />
      <polygon points="12,68 50,4 88,68" fill="url(#mtL)" />
      <polygon points="50,4 88,68 56,68 46,34" fill="#c77a22" opacity=".85" />
      <polygon points="50,4 46,34 30,58 36,32" fill="#fff0b0" opacity=".7" />
      <path d="M50 4 L46 34 L56 68 M30 58 L46 34 M70 50 L56 68" stroke="#8a4a10" strokeWidth="1.2" fill="none" opacity=".6" />
    </svg>
  </span>
)

const Cross = () => (
  <span className="tl-art cross" aria-hidden>
    <span className="tl-rays" />
    <svg viewBox="0 0 40 64">
      <defs>
        <linearGradient id="crV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f3b24a" />
          <stop offset=".5" stopColor="#b8691c" />
          <stop offset="1" stopColor="#6b3410" />
        </linearGradient>
        <linearGradient id="crH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c25e" />
          <stop offset="1" stopColor="#8a4a14" />
        </linearGradient>
      </defs>
      <rect x="15" y="2" width="10" height="62" fill="url(#crV)" stroke="#5a2c0a" strokeWidth="1" />
      <rect x="2" y="15" width="36" height="10" fill="url(#crH)" stroke="#5a2c0a" strokeWidth="1" />
      <rect x="15" y="15" width="10" height="10" fill="#d98a2b" />
    </svg>
  </span>
)

const ages = [
  { from: 0, to: 4, label: 'Patriarchal — Family Religion', cls: 'patriarchal' },
  { from: 4, to: 14, label: 'Mosaic — National Religion (Jews)', cls: 'mosaic' },
  { from: 14, to: 15, label: 'Christ', cls: 'christian' },
]

const pct = (col: number) => `${(col / 15) * 100}%`
const span = (from: number, to: number) => ({ left: pct(from), width: pct(to - from) })

const BOARD_MIN = 1500
const MIN_ZOOM = 0.6 // below this width the board scrolls sideways instead of shrinking

export default function Glance() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  // Shrink the board to fit narrow viewports instead of scrolling horizontally.
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setZoom(Math.max(MIN_ZOOM, Math.min(1, el.clientWidth / BOARD_MIN)))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <section className="glance">
      <div className="glance-scroll" ref={wrapRef}>
        <div className="glance-board" style={{ zoom }}>
          <header className="glance-head">
            <div className="glance-facts">
              <b>The Bible</b>
              <span>66 Books</span>
              <span>≈ 40 Writers</span>
              <span>≈ 1,600 Years</span>
            </div>
            <div className="glance-title">
              <h1>The Bible at a Glance</h1>
              <p>One Story · 15 Periods · About 4,000 Years</p>
            </div>
          </header>

          <div className="glance-bands" aria-hidden>
            <div className="band ot" style={span(0, 12)}>
              Old Testament<small>(39 Books)</small>
            </div>
            <div className="band silence" style={span(12, 13)}>
              Silence<small>≈ 400 Years</small>
            </div>
            <div className="band nt" style={span(13, 15)}>
              New Testament<small>(27 Books)</small>
            </div>
          </div>

          <ul className="glance-cards">
            {periods.map((p) => (
              <li key={p.number} className={p.testament}>
                <Link to={`/learn/${p.number}`} aria-label={`Open period ${p.number}, ${p.rhyme}, ${p.name}`}>
                  <span className="g-art">
                    <img src={p.image} alt="" loading="lazy" />
                    <span className="g-badge">{p.number}</span>
                  </span>
                  <span className="g-label">
                    <strong>{p.rhyme}</strong>
                    <span>{nameOverrides[p.number] ?? p.name}</span>
                    {details[p.number] && <em>{details[p.number]}</em>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="glance-timeline" aria-label="Timeline">
            <div className="tl-line" />
            {timeline.map((m) => (
              <div key={m.date} className="tl-mark" style={{ left: pct(m.at) }}>
                {m.icon === 'mountain' && <Mountain />}
                {m.icon === 'cross' && <Cross />}
                <i />
                <b>{m.date}</b>
                {m.note && (
                  <span className="tl-note">
                    <strong>{m.note[0]}</strong>
                    <span>{m.note[1]}</span>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="glance-ages">
            {ages.map((a) => (
              <div key={a.cls} className={`age ${a.cls}`} style={span(a.from, a.to)}>
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
