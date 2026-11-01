import { SquarePlus } from 'lucide-react'
import { useState } from 'react'

export default function InstallHelp() {
  const [open, setOpen] = useState(false)
  const installed =
    window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
  if (installed) return null

  return (
    <>
      <button className="ghost install-btn" onClick={() => setOpen(true)} title="Add to Home Screen" aria-label="Add to Home Screen">
        <SquarePlus size={18} aria-hidden />
      </button>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Add to Home Screen" onClick={(e) => e.stopPropagation()}>
            <h2>Add to Home Screen</h2>
            <p>On iPhone or iPad, open this page in Safari, then:</p>
            <ol>
              <li>Tap the <b>Share</b> button (square with an arrow).</li>
              <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
              <li>Tap <b>Add</b>.</li>
            </ol>
            <p>The app will open full screen from its own icon.</p>
            <button onClick={() => setOpen(false)}>Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
