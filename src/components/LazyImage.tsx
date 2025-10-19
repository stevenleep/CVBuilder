/**
 * 懒加载图片组件
 *
 * 性能优化：
 * - 使用 Intersection Observer API
 * - 支持占位符
 * - 支持加载失败处理
 */

import React, { useState, useEffect, useRef } from 'react'

interface LazyImageProps {
  src: string
  alt?: string
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  placeholder,
  className,
  style,
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // 创建 Intersection Observer
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 图片进入视口，开始加载
            setImageSrc(src)
            // 停止观察
            if (imgRef.current && observerRef.current) {
              observerRef.current.unobserve(imgRef.current)
            }
          }
        })
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.01,
      }
    )

    // 开始观察
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    // 清理
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  return (
    <div className={`cvkit-lazy-image-container ${className || ''}`} style={style}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`cvkit-lazy-image ${isLoading ? 'cvkit-lazy-image-loading' : 'cvkit-lazy-image-loaded'}`}
      />

      {/* 加载中占位符 */}
      {isLoading && !hasError && (
        <div className="cvkit-lazy-image-placeholder">
          <div className="cvkit-spinner cvkit-spinner-sm" />
        </div>
      )}

      {/* 加载失败提示 */}
      {hasError && <div className="cvkit-lazy-image-error">加载失败</div>}
    </div>
  )
}
