/**
 * Panel 组件
 * 
 * 通用面板容器，支持标题、工具栏和可折叠
 */

import React, { useState } from 'react'

export interface PanelProps {
  /** 面板标题 */
  title?: React.ReactNode
  /** 面板内容 */
  children?: React.ReactNode
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认是否折叠 */
  defaultCollapsed?: boolean
  /** 工具栏内容 */
  toolbar?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 折叠状态改变回调 */
  onCollapsedChange?: (collapsed: boolean) => void
}

/**
 * Panel 组件
 */
export const Panel: React.FC<PanelProps> = ({
  title,
  children,
  collapsible = false,
  defaultCollapsed = false,
  toolbar,
  className = '',
  style,
  onCollapsedChange,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  
  const baseClass = 'lcedit-panel'
  const collapsedClass = collapsed ? `${baseClass}--collapsed` : ''
  
  const classes = [baseClass, collapsedClass, className].filter(Boolean).join(' ')
  
  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }
  
  return (
    <div className={classes} style={style}>
      {(title || toolbar) && (
        <div className={`${baseClass}__header`}>
          {title && (
            <div className={`${baseClass}__title`}>
              {collapsible && (
                <button
                  className={`${baseClass}__collapse-btn`}
                  onClick={handleToggleCollapse}
                  aria-label={collapsed ? '展开' : '折叠'}
                >
                  {collapsed ? '▶' : '▼'}
                </button>
              )}
              <span className={`${baseClass}__title-text`}>{title}</span>
            </div>
          )}
          {toolbar && (
            <div className={`${baseClass}__toolbar`}>{toolbar}</div>
          )}
        </div>
      )}
      {!collapsed && (
        <div className={`${baseClass}__body`}>{children}</div>
      )}
    </div>
  )
}

Panel.displayName = 'Panel'

