import { useEffect, useState } from 'react'

const REQUETE_MODE_SOMBRE = '(prefers-color-scheme: dark)'

export function usePrefersDarkMode(): boolean {
  const [prefersDark, setPrefersDark] = useState(() => window.matchMedia(REQUETE_MODE_SOMBRE).matches)

  useEffect(() => {
    const media = window.matchMedia(REQUETE_MODE_SOMBRE)
    const onChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return prefersDark
}
