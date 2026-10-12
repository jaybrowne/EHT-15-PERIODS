import { BookOpen, GraduationCap, Grid3x3, Maximize, Minimize, PencilLine } from 'lucide-react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { appTitle, dataProblems } from './data'
import { useFullscreen } from './hooks'
import Learn from './pages/Learn'
import MemoryMap from './pages/MemoryMap'
import Overview from './pages/Overview'
import Practice from './pages/Practice'

const links = [
  { to: '/overview', label: 'Bible Overview', icon: BookOpen },
  { to: '/map', label: 'Memory Map', icon: Grid3x3 },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/practice', label: 'Practice', icon: PencilLine },
]

export default function App() {
  const fs = useFullscreen()

  if (dataProblems.length) {
    return (
      <div className="problems">
        <h1>Content problems</h1>
        <ul>
          {dataProblems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="nav">
        <span className="brand">{appTitle}</span>
        <nav aria-label="Primary">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={18} aria-hidden /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        {fs.supported && (
          <button className="ghost" onClick={fs.toggle} aria-pressed={fs.active}>
            {fs.active ? <Minimize size={18} aria-hidden /> : <Maximize size={18} aria-hidden />}
            <span>{fs.active ? 'Exit Presentation' : 'Presentation Mode'}</span>
          </button>
        )}
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/map" element={<MemoryMap />} />
          <Route path="/learn" element={<Navigate to="/learn/1" replace />} />
          <Route path="/learn/:number" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>
      </main>
    </div>
  )
}
