import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { periods, type Period } from '../data'
import { useLocalStorage } from '../hooks'

type Kind = 'rhyme' | 'name' | 'number'

const kinds: { id: Kind; label: string; prompt: string }[] = [
  { id: 'rhyme', label: 'Picture → Rhyme', prompt: 'What is the memory rhyme for this picture?' },
  { id: 'name', label: 'Picture → Period', prompt: 'Which period of Bible history is this?' },
  { id: 'number', label: 'Picture → Number', prompt: 'Which number is this period?' },
]

const answerOf = (p: Period, k: Kind) => (k === 'rhyme' ? p.rhyme : k === 'name' ? p.name : String(p.number))

const shuffle = <T,>(items: T[]) => {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Question {
  period: Period
  options: Period[]
}

const buildQuiz = (): Question[] =>
  shuffle(periods).map((period) => ({
    period,
    options: shuffle([period, ...shuffle(periods.filter((p) => p !== period)).slice(0, 3)]),
  }))

type Progress = Record<number, { right: number; tries: number }>

export default function Practice() {
  const [kind, setKind] = useState<Kind>('rhyme')
  const [quiz, setQuiz] = useState(buildQuiz)
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useLocalStorage<Progress>('eht15.practice', {})

  const done = idx >= quiz.length
  const q = quiz[idx]
  const meta = kinds.find((k) => k.id === kind)!

  const restart = (k: Kind = kind) => {
    setKind(k)
    setQuiz(buildQuiz())
    setIdx(0)
    setPicked(null)
    setScore(0)
  }

  const choose = (p: Period) => {
    if (picked !== null) return
    const right = p === q.period
    setPicked(p.number)
    if (right) setScore((s) => s + 1)
    setProgress((prev) => {
      const cur = prev[q.period.number] ?? { right: 0, tries: 0 }
      return { ...prev, [q.period.number]: { right: cur.right + (right ? 1 : 0), tries: cur.tries + 1 } }
    })
  }

  const mastered = periods.filter((p) => (progress[p.number]?.right ?? 0) > 0).length

  return (
    <section className="practice">
      <div className="toolbar">
        <div className="segmented" role="radiogroup" aria-label="Practice type">
          {kinds.map((k) => (
            <button
              key={k.id}
              role="radio"
              aria-checked={kind === k.id}
              className={kind === k.id ? 'on' : ''}
              onClick={() => restart(k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>
        <span className="progress">Periods answered correctly at least once: {mastered} / 15</span>
        <button className="ghost" onClick={() => setProgress({})}>
          Reset progress
        </button>
      </div>

      {done ? (
        <div className="quiz-done">
          <h1>
            {score} / {quiz.length}
          </h1>
          <p>Round complete.</p>
          <button onClick={() => restart()}>
            <RotateCcw size={18} aria-hidden /> Practice again
          </button>
        </div>
      ) : (
        <div className="quiz">
          <div className="quiz-art">
            <img src={q.period.image} alt="" />
          </div>
          <div className="quiz-side">
            <p className="progress">
              Question {idx + 1} of {quiz.length} · Score {score}
            </p>
            <h1>{kind === 'name' ? `${meta.prompt} (${q.period.rhyme})` : meta.prompt}</h1>
            <div className="options">
              {q.options.map((o) => {
                const state =
                  picked === null ? '' : o === q.period ? 'right' : o.number === picked ? 'wrong' : 'dim'
                return (
                  <button key={o.number} className={`option ${state}`} onClick={() => choose(o)} disabled={picked !== null}>
                    {answerOf(o, kind)}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <div className="feedback" aria-live="polite">
                <p>
                  {picked === q.period.number ? 'Correct!' : 'Not quite.'} {q.period.number} — {q.period.rhyme} —{' '}
                  {q.period.name}
                </p>
                <button
                  onClick={() => {
                    setIdx(idx + 1)
                    setPicked(null)
                  }}
                >
                  {idx + 1 === quiz.length ? 'Finish' : 'Next question'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
