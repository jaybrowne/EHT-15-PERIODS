import { ArrowLeft, ArrowRight, ChevronDown, Eye, EyeOff, Grid3x3 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getPeriod, periods } from '../data'
import { useLocalStorage, useShortcuts } from '../hooks'

export default function Learn() {
  const { number } = useParams()
  const navigate = useNavigate()
  const period = getPeriod(Number(number))
  const [showName, setShowName] = useLocalStorage('eht15.learnName', true)
  const [showDesc, setShowDesc] = useLocalStorage('eht15.learnDesc', true)
  const [showExplain, setShowExplain] = useState(false)
  const [showBooks, setShowBooks] = useState(false)

  const n = period?.number ?? 1
  const go = (to: number) => {
    if (to >= 1 && to <= periods.length) navigate(`/learn/${to}`)
  }

  // Space reveals the next hidden item (name, then description); if all shown, hides both.
  const cycle = () => {
    if (!showName) setShowName(true)
    else if (!showDesc) setShowDesc(true)
    else {
      setShowName(false)
      setShowDesc(false)
    }
  }

  useShortcuts({
    ArrowRight: () => go(n + 1),
    ArrowLeft: () => go(n - 1),
    ' ': cycle,
    Escape: () => navigate('/map'),
  })

  if (!period) return <Navigate to="/learn/1" replace />

  return (
    <section className={`learn ${period.testament}`}>
      <div className="learn-art">
        <img src={period.image} alt={`Illustration for period ${period.number}: ${period.rhyme}`} />
      </div>

      <div className="learn-info">
        <p className="progress">
          Period {n} of {periods.length}
        </p>
        <div className="progress-bar" aria-hidden>
          <span style={{ width: `${(n / periods.length) * 100}%` }} />
        </div>

        <h1 className="learn-title">
          <span className="learn-num">{n}</span> {period.rhyme}
        </h1>
        <h2 className={`learn-name ${showName ? '' : 'masked'}`} aria-live="polite">
          {showName ? period.name : 'Period name hidden'}
        </h2>

        <div className="learn-actions">
          <button className="ghost" onClick={() => setShowName(!showName)} aria-pressed={showName}>
            {showName ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
            {showName ? 'Hide name' : 'Reveal name'}
          </button>
          <button className="ghost" onClick={() => setShowDesc(!showDesc)} aria-pressed={showDesc}>
            {showDesc ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
            {showDesc ? 'Hide description' : 'Reveal description'}
          </button>
        </div>

        {showDesc && (
          <div className="desc">
            <h3>Memory scene</h3>
            <p>{period.memoryScene}</p>
            {period.historicalExplanation && (
              <div className={`expand ${showExplain ? 'open' : ''}`}>
                <button className="expand-head" onClick={() => setShowExplain(!showExplain)} aria-expanded={showExplain}>
                  <ChevronDown size={18} aria-hidden /> Historical explanation
                </button>
                {showExplain && <p>{period.historicalExplanation}</p>}
              </div>
            )}
          </div>
        )}

        <div className={`expand books-box ${showBooks ? 'open' : ''}`}>
          <button className="expand-head" onClick={() => setShowBooks(!showBooks)} aria-expanded={showBooks}>
            <ChevronDown size={18} aria-hidden /> Books of the Bible
          </button>
          {showBooks &&
            (period.bibleBooks.length ? (
              <ul className="book-list">
                {period.bibleBooks.map((b) => (
                  <li key={`${b.book}${b.scope ?? ''}`}>
                    {b.book}
                    {b.scope && <small> {b.scope}</small>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="book-none">No books of the Bible were written during this period.</p>
            ))}
        </div>

        <div className="learn-nav">
          <button onClick={() => go(n - 1)} disabled={n === 1}>
            <ArrowLeft size={18} aria-hidden /> Previous
          </button>
          <button className="ghost" onClick={() => navigate('/map')}>
            <Grid3x3 size={18} aria-hidden /> Memory Map
          </button>
          <button onClick={() => go(n + 1)} disabled={n === periods.length}>
            Next <ArrowRight size={18} aria-hidden />
          </button>
        </div>
        <p className="hint">← → change period · Space reveal/hide · Esc back to map</p>
      </div>
    </section>
  )
}
