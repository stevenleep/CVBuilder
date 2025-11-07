/**
 * 主题上下文
 * 
 * 提供主题配置和切换的 React Context
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

// ==================== 类型定义 ====================

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题配置
 */
export interface ThemeConfig {
  mode: ThemeMode
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  customColors?: Record<string, string>
}

/**
 * 主题操作
 */
export interface ThemeActions {
  setMode: (mode: ThemeMode) => void
  setPrimaryColor: (color: string) => void
  setCustomColor: (key: string, color: string) => void
  resetTheme: () => void
}

/**
 * 主题上下文值
 */
export interface ThemeContextValue {
  theme: ThemeConfig
  actions: ThemeActions
}

// ==================== 默认主题 ====================

const defaultTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1890ff',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  borderColor: '#d9d9d9',
  customColors: {},
}

// ==================== Context ====================

const ThemeContext = createContext<ThemeContextValue | null>(null)

// ==================== Provider ====================

export interface ThemeProviderProps {
  initialTheme?: Partial<ThemeConfig>
  children: React.ReactNode
}

export function ThemeProvider({ initialTheme, children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig>(() => ({
    ...defaultTheme,
    ...initialTheme,
  }))
  
  // 监听系统主题变化
  React.useEffect(() => {
    if (theme.mode !== 'auto') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(prev => ({
        ...prev,
        mode: e.matches ? 'dark' : 'light',
      }))
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme.mode])
  
  // Actions
  const setMode = useCallback((mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }))
  }, [])
  
  const setPrimaryColor = useCallback((color: string) => {
    setTheme(prev => ({ ...prev, primaryColor: color }))
  }, [])
  
  const setCustomColor = useCallback((key: string, color: string) => {
    setTheme(prev => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        [key]: color,
      },
    }))
  }, [])
  
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme)
  }, [])
  
  const actions = useMemo<ThemeActions>(() => ({
    setMode,
    setPrimaryColor,
    setCustomColor,
    resetTheme,
  }), [setMode, setPrimaryColor, setCustomColor, resetTheme])
  
  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    actions,
  }), [theme, actions])
  
  // 应用主题到 DOM
  React.useEffect(() => {
    const root = document.documentElement
    
    root.setAttribute('data-theme', theme.mode)
    
    if (theme.primaryColor) {
      root.style.setProperty('--primary-color', theme.primaryColor)
    }
    if (theme.backgroundColor) {
      root.style.setProperty('--background-color', theme.backgroundColor)
    }
    if (theme.textColor) {
      root.style.setProperty('--text-color', theme.textColor)
    }
    if (theme.borderColor) {
      root.style.setProperty('--border-color', theme.borderColor)
    }
    
    // 应用自定义颜色
    if (theme.customColors) {
      Object.entries(theme.customColors).forEach(([key, color]) => {
        root.style.setProperty(`--${key}`, color)
      })
    }
  }, [theme])
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ==================== Hooks ====================

/**
 * 使用主题上下文
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  
  return context
}

/**
 * 使用主题
 */
export function useTheme(): ThemeConfig {
  return useThemeContext().theme
}

/**
 * 使用主题操作
 */
export function useThemeActions(): ThemeActions {
  return useThemeContext().actions
}

