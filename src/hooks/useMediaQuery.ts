/**
 * 媒体查询 Hook
 *
 * 用于响应式设计，检测屏幕尺寸变化
 */

import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // 初始检查
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // 监听变化
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // 兼容性处理
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Safari < 14 兼容性
      media.addListener(listener)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [query, matches])

  return matches
}

// 常用媒体查询
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const useIsSmallScreen = () => useMediaQuery('(max-width: 1024px)')
