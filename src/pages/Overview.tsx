import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { bibleImages } from '../data'
import { useShortcuts } from '../hooks'

// Overview text is separate teaching content, not taken from the source PowerPoint.
const screens = [
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
]

export default function Overview() {
  const [i, setI] = useState(0)
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
        <div className="learn-nav">
          <button onClick={prev} disabled={i === 0}>
            <ArrowLeft size={18} aria-hidden /> Previous
          </button>
          <span className="progress">
            {i + 1} / {screens.length}
          </span>
          <button onClick={next} disabled={i === screens.length - 1}>
            Next <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  )
}
