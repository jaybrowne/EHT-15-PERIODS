import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage unavailable; preferences simply won't persist
    }
  }, [key, value])
  return [value, setValue] as const
}

const isTyping = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

const isInteractive = (el: EventTarget | null) =>
  el instanceof HTMLElement && (isTyping(el) || ['BUTTON', 'A', 'SUMMARY'].includes(el.tagName))

/** Global key handler that stays out of the way of inputs and (for Space/Enter) buttons. */
export function useShortcuts(handlers: Partial<Record<string, () => void>>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
      const handler = handlers[e.key]
      if (!handler) return
      const blocked = e.key === ' ' ? isInteractive(e.target) : isTyping(e.target)
      if (blocked) return
      e.preventDefault()
      handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
}

export function useFullscreen() {
  const [active, setActive] = useState(!!document.fullscreenElement)
  useEffect(() => {
    const onChange = () => setActive(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  const supported = document.fullscreenEnabled
  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }, [])
  return { active, supported, toggle }
}
