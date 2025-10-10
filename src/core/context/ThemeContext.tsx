/**
 * 主题上下文
 *
 * 提供全局主题配置
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { ITheme, IThemeContext } from '../protocols/IThemeProtocol'
import { modernTheme } from '../theme/themes'
import { indexedDBService, STORES } from '@utils/indexedDB'

const ThemeContext = createContext<IThemeContext | null>(null)

const THEME_KEY = 'current-theme'

export const ThemeProvider: React.FC<{
  children: ReactNode
  initialTheme?: ITheme
}> = ({ children, initialTheme = modernTheme }) => {
  const [theme, setThemeState] = useState<ITheme>(initialTheme)
  const [isLoaded, setIsLoaded] = useState(false)

  // 加载主题
  useEffect(() => {
    indexedDBService
      .getItem<ITheme>(STORES.THEME, THEME_KEY)
      .then(savedTheme => {
        if (savedTheme) {
          setThemeState(savedTheme)
        }
        setIsLoaded(true)
      })
      .catch(() => {
        setIsLoaded(true)
      })
  }, [])

  // 保存主题
  useEffect(() => {
    if (isLoaded) {
      indexedDBService.setItem(STORES.THEME, THEME_KEY, theme).catch(() => {
        // 静默失败
      })
    }
  }, [theme, isLoaded])

  const setTheme = (newTheme: ITheme) => {
    setThemeState(newTheme)
  }

  const updateTheme = (config: Partial<ITheme>) => {
    setThemeState(prev => ({
      ...prev,
      ...config,
      font: { ...prev.font, ...(config.font || {}) },
      color: { ...prev.color, ...(config.color || {}) },
      spacing: { ...prev.spacing, ...(config.spacing || {}) },
      layout: { ...prev.layout, ...(config.layout || {}) },
      style: { ...prev.style, ...(config.style || {}) },
    }))
  }

  const value: IThemeContext = {
    theme,
    setTheme,
    updateTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * 使用主题的Hook
 */
export function useTheme(): IThemeContext {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

/**
 * 快速访问主题配置的Hooks
 */
export function useThemeConfig(): ITheme {
  const { theme } = useTheme()
  return theme
}

export function useFontConfig() {
  const { theme } = useTheme()
  return theme.font
}

export function useColorConfig() {
  const { theme } = useTheme()
  return theme.color
}

export function useSpacingConfig() {
  const { theme } = useTheme()
  return theme.spacing
}

export function useLayoutConfig() {
  const { theme } = useTheme()
  return theme.layout
}

export function useStyleConfig() {
  const { theme } = useTheme()
  return theme.style
}
