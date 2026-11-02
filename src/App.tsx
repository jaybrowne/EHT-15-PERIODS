import { BookOpen, GraduationCap, Grid3x3, Library as LibraryIcon, Maximize, Minimize, PencilLine, Route as RouteIcon } from 'lucide-react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { appTitle, dataProblems } from './data'
import { useFullscreen } from './hooks'
import Glance from './pages/Glance'
import Learn from './pages/Learn'
import Library from './pages/Library'
import MemoryMap from './pages/MemoryMap'
import Overview from './pages/Overview'
import Practice from './pages/Practice'

const links = [
  { to: '/glance', label: 'At a Glance', icon: RouteIcon },
  { to: '/overview', label: 'Bible Overview', icon: BookOpen },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/practice', label: 'Practice', icon: PencilLine },
  { to: '/map', label: 'Memory Map', icon: Grid3x3 },
  { to: '/library', label: 'Library', icon: LibraryIcon },
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
          <button className="ghost" onClick={fs.toggle} aria-pressed={fs.active} title={fs.active ? 'Exit Presentation' : 'Presentation Mode'} aria-label={fs.active ? 'Exit Presentation' : 'Presentation Mode'}>
            {fs.active ? <Minimize size={18} aria-hidden /> : <Maximize size={18} aria-hidden />}
          </button>
        )}
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/glance" replace />} />
          <Route path="/glance" element={<Glance />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/map" element={<MemoryMap />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:number" element={<Learn />} />
          <Route path="/library" element={<Library />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>
      </main>
    </div>
  )
}
