import { useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'tradesphere-theme'

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.classList.toggle('light', !dark)
}

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    applyTheme(dark)
  }, [dark])

  const toggle = () => {
    const next = !dark
    setDark(next)
    window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
  }

  return { dark, toggle }
}
