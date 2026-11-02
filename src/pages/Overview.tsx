import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bibleImages } from '../data'
import { useShortcuts } from '../hooks'
import { leather, library, periodsForBook, type LibraryBook, type Shelf } from '../library'

const sectionStat = (key: 'ot' | 'nt') => {
  const t = library.find((x) => x.key === key)!
  return t.shelves.map((s) => ({ key: s.key, title: s.title, count: s.books.length }))
}

// Overview text is separate teaching content, not taken from the source PowerPoint.
interface Screen {
  key: string
  image: string | undefined
  alt: string
  title: string
  lines: string[]
  sections?: { key: string; title: string; count: number }[]
  cls?: 'ot' | 'nt'
  shelf?: Shelf
}

const shelfScreens = (testament: 'ot' | 'nt'): Screen[] =>
  library
    .find((t) => t.key === testament)!
    .shelves.map((s) => ({
      key: `${testament}-${s.key}`,
      image: bibleImages.open,
      alt: 'An open Bible in golden light',
      title: testament === 'ot' ? `Old Testament: ${s.title}` : `New Testament: ${s.title}`,
      lines: [],
      sections: sectionStat(testament),
      cls: testament,
      shelf: s,
    }))

const screens: Screen[] = [
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
  ...shelfScreens('ot'),
  {
    key: 'nt-sections',
    image: bibleImages.open,
    alt: 'An open Bible in golden light',
    title: 'The New Testament',
    lines: ['The 27 books of the New Testament fall into five sections.'],
    sections: sectionStat('nt'),
    cls: 'nt',
  },
  ...shelfScreens('nt'),
]

export default function Overview() {
  const [i, setI] = useState(0)
  const [sel, setSel] = useState<LibraryBook | null>(null)
  const navigate = useNavigate()
  const screen = screens[i]
  const prev = () => setI((v) => Math.max(0, v - 1))
  const next = () => setI((v) => Math.min(screens.length - 1, v + 1))

  useEffect(() => setSel(null), [i])
  useShortcuts({ ArrowLeft: prev, ArrowRight: next })
  const bookPeriods = sel ? periodsForBook(sel.name) : []

  return (
    <section className={`overview${screen.shelf ? ' shelf-mode' : ''}`}>
      {screen.shelf ? (
        <div className="bookcase ov-case">
          <div className="spines">
            {screen.shelf.books.map((bk, n) => (
              <button
                key={bk.name}
                className={`spine${sel === bk ? ' on' : ''}`}
                style={
                  {
                    '--leather': leather[(n + screen.shelf!.key.length) % leather.length],
                    '--ht': `${88 + ((n * 7) % 4) * 4}%`,
                  } as React.CSSProperties
                }
                onMouseEnter={() => setSel(bk)}
                onFocus={() => setSel(bk)}
                onClick={() => setSel(bk)}
                aria-label={bk.name}
              >
                <span>
                  {bk.name}
                  {bk.note && '*'}
                </span>
              </button>
            ))}
          </div>
          <div className="plank" />
        </div>
      ) : (
        <div className="overview-art">
          <img src={screen.image} alt={screen.alt} />
        </div>
      )}
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
              <div
                key={s.key}
                className={`stat ${screen.cls}${screen.shelf && screen.shelf.key !== s.key ? ' dim' : ''}`}
              >
                <b>{s.count}</b>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        )}
        {screen.shelf && (
          <>
            <div className="lib-detail ov-detail" aria-live="polite">
              {sel ? (
                <>
                  <h2>{sel.name}</h2>
                  <p>{sel.summary}</p>
                  {sel.note && <p className="lib-note">* {sel.note}</p>}
                  {bookPeriods.length > 0 && (
                    <p className="lib-periods">
                      {bookPeriods.length > 1 ? 'Periods: ' : 'Period: '}
                      {bookPeriods.map((p, n) => (
                        <span key={p.number}>
                          {n > 0 && ', '}
                          <Link to={`/learn/${p.number}`}>
                            {p.number}. {p.name}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </>
              ) : (
                <p className="lib-hint">Hover over or tap a book to see what it is about.</p>
              )}
            </div>
          </>
        )}
        <div className="learn-nav">
          <button onClick={prev} disabled={i === 0}>
            <ArrowLeft size={18} aria-hidden /> Previous
          </button>
          <span className="progress">
            {i + 1} / {screens.length}
          </span>
          {i === screens.length - 1 ? (
            <button onClick={() => navigate('/learn')}>
              Start Learning <ArrowRight size={18} aria-hidden />
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
