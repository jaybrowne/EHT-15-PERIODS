import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bibleImages } from '../data'
import { useShortcuts } from '../hooks'
import { library } from '../library'

const sectionStat = (key: 'ot' | 'nt') => {
  const t = library.find((x) => x.key === key)!
  return t.shelves.map((s) => ({ title: s.title, count: s.books.length }))
}

// Overview text is separate teaching content, not taken from the source PowerPoint.
const screens: {
  key: string
  image: string | undefined
  alt: string
  title: string
  lines: string[]
  sections?: { title: string; count: number }[]
  cls?: 'ot' | 'nt'
}[] = [
  {
    key: 'bible',
    image: bibleImages.closed,
    alt: 'A closed Bible resting in a sunlit study',
    title: 'The Bible',
    lines: [
      'The Bible is a collection of books that together form one unified account.',
      'The 15 Periods give us a simple memory framework for following that account from beginning to end.',
    ],
  },
  {
    key: 'testaments',
    image: bibleImages.open,
    alt: 'An open Bible in golden light',
    title: 'Two Testaments',
    lines: [],
  },
  {
    key: 'ot-sections',
    image: bibleImages.open,
    alt: 'An open Bible in golden light',
    title: 'The Old Testament',
    lines: ['The 39 books of the Old Testament fall into five sections.'],
    sections: sectionStat('ot'),
    cls: 'ot',
  },
  {
    key: 'nt-sections',
    image: bibleImages.open,
    alt: 'An open Bible in golden light',
    title: 'The New Testament',
    lines: ['The 27 books of the New Testament fall into five sections.'],
    sections: sectionStat('nt'),
    cls: 'nt',
  },
]

export default function Overview() {
  const [i, setI] = useState(0)
  const navigate = useNavigate()
  const screen = screens[i]
  const prev = () => setI((v) => Math.max(0, v - 1))
  const next = () => setI((v) => Math.min(screens.length - 1, v + 1))

  useShortcuts({ ArrowLeft: prev, ArrowRight: next })

  return (
    <section className="overview">
      <div className="overview-art">
        <img src={screen.image} alt={screen.alt} />
      </div>
      <div className="overview-text">
        <h1>{screen.title}</h1>
        {screen.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
        {screen.key === 'testaments' && (
          <div className="books">
            <div className="stat ot">
              <b>39</b>
              <span>Old Testament books</span>
            </div>
            <div className="stat nt">
              <b>27</b>
              <span>New Testament books</span>
            </div>
            <div className="stat total">
              <b>66</b>
              <span>Total books</span>
            </div>
          </div>
        )}
        {screen.sections && (
          <div className="books compact">
            {screen.sections.map((s) => (
              <div key={s.title} className={`stat ${screen.cls}`}>
                <b>{s.count}</b>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        )}
        <div className="learn-nav">
          <button onClick={prev} disabled={i === 0}>
            <ArrowLeft size={18} aria-hidden /> Previous
          </button>
          <span className="progress">
            {i + 1} / {screens.length}
          </span>
          {i === screens.length - 1 ? (
            <button onClick={() => navigate('/library')}>
              Go to Library <ArrowRight size={18} aria-hidden />
            </button>
          ) : (
            <button onClick={next}>
              Next <ArrowRight size={18} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
