import { useState } from 'react'
import { Link } from 'react-router-dom'
import { library, periodsForBook, type LibraryBook, type Shelf } from '../library'

interface Selected {
  book: LibraryBook
  shelf: Shelf
}

const leather = ['#9a4a22', '#4a6670', '#a03030', '#6e4a28', '#3f5a50', '#b0732c']

export default function Library() {
  const [sel, setSel] = useState<Selected | null>(null)
  const bookPeriods = sel ? periodsForBook(sel.book.name) : []

  return (
    <div className="library">
      <aside className="lib-detail" aria-live="polite">
        {sel ? (
          <>
            <h2>
              {sel.book.name}
              {sel.book.note && <span title={sel.book.note}>*</span>}
              <small>{sel.shelf.title}</small>
            </h2>
            <p>{sel.book.summary}</p>
            {sel.book.note && <p className="lib-note">* {sel.book.note}</p>}
            <p className="lib-periods">
              {bookPeriods.length ? (
                <>
                  {bookPeriods.length > 1 ? 'Periods: ' : 'Period: '}
                  {bookPeriods.map((p, i) => (
                    <span key={p.number}>
                      {i > 0 && ', '}
                      <Link to={`/learn/${p.number}`}>
                        {p.number}. {p.name}
                      </Link>
                    </span>
                  ))}
                </>
              ) : (
                'Period: not assigned'
              )}
            </p>
          </>
        ) : (
          <p className="lib-hint">Hover over or tap a book to see what it is about and which Bible period it belongs to.</p>
        )}
      </aside>

      <div className="bookcase">
        <div className="plaque plaque-title">The Bible</div>
        {library.map((t) => (
          <section key={t.key} className="tier">
            <div className="plaque">
              {t.title} ({t.shelves.reduce((n, s) => n + s.books.length, 0)} Books)
            </div>
            <div className="groups">
              {t.shelves.map((s) => (
                <div key={s.key} className="group" style={{ flexGrow: s.books.length }}>
                  <div className="spines">
                    {s.books.map((bk, i) => (
                      <button
                        key={bk.name}
                        className={`spine${sel?.book === bk ? ' on' : ''}`}
                        style={
                          {
                            '--leather': leather[(i + s.key.length) % leather.length],
                            '--ht': `${88 + ((i * 7) % 4) * 4}%`,
                          } as React.CSSProperties
                        }
                        onMouseEnter={() => setSel({ book: bk, shelf: s })}
                        onFocus={() => setSel({ book: bk, shelf: s })}
                        onClick={() => setSel({ book: bk, shelf: s })}
                        aria-label={bk.name}
                      >
                        <span>
                          {bk.name}
                          {bk.note && '*'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="label">
                    {s.title}
                    <br />({s.books.length})
                  </div>
                </div>
              ))}
            </div>
            <div className="plank" />
          </section>
        ))}
      </div>
    </div>
  )
}
