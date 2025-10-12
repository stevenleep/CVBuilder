/**
 * 主题设置组件
 *
 * 在属性面板中显示的主题设置
 */

import React, { useState } from 'react'
import { useTheme } from '@/core/context/ThemeContext'
import { presetThemes } from '@/core/theme/themes'

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme, updateTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'presets' | 'fonts' | 'styles'>('presets')

  // 系统字体列表
  const systemFonts = [
    {
      label: '系统默认',
      value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    { label: '黑体', value: '"PingFang SC", "Microsoft YaHei", "Heiti SC", sans-serif' },
    { label: '宋体', value: '"SimSun", "STSong", serif' },
    { label: '楷体', value: '"KaiTi", "STKaiti", serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
  ]

  return (
    <div style={{ padding: '12px' }}>
      {/* Tab导航 - 简化 */}
      <div
        style={{
          display: 'flex',
          gap: '3px',
          marginBottom: '12px',
          backgroundColor: '#f5f5f5',
          padding: '2px',
          borderRadius: '5px',
        }}
      >
        {[
          { id: 'presets', label: '预设' },
          { id: 'fonts', label: '字体' },
          { id: 'styles', label: '样式' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              height: '26px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#2d2d2d' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#888',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      {activeTab === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {presetThemes.map(preset => (
            <ThemeCard
              key={preset.id}
              theme={preset}
              active={theme.id === preset.id}
              onClick={() => setTheme(preset)}
            />
          ))}
        </div>
      )}

      {activeTab === 'fonts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 字体族 */}
          <SelectInput
            label="字体"
            value={theme.font.family}
            options={systemFonts}
            onChange={val =>
              updateTheme({
                font: { ...theme.font, family: val },
              })
            }
          />

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 标题字号 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <InputGroup
              label="姓名"
              value={theme.font.titleSize.h1}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    titleSize: { ...theme.font.titleSize, h1: val },
                  },
                })
              }
            />
            <InputGroup
              label="章节"
              value={theme.font.titleSize.h2}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    titleSize: { ...theme.font.titleSize, h2: val },
                  },
                })
              }
            />
            <InputGroup
              label="小标题"
              value={theme.font.titleSize.h3}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    titleSize: { ...theme.font.titleSize, h3: val },
                  },
                })
              }
            />
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 正文字号 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <InputGroup
              label="大字号"
              value={theme.font.bodySize.large}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    bodySize: { ...theme.font.bodySize, large: val },
                  },
                })
              }
            />
            <InputGroup
              label="正文"
              value={theme.font.bodySize.normal}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    bodySize: { ...theme.font.bodySize, normal: val },
                  },
                })
              }
            />
            <InputGroup
              label="小字号"
              value={theme.font.bodySize.small}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    bodySize: { ...theme.font.bodySize, small: val },
                  },
                })
              }
            />
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 字重 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <InputGroup
              label="加粗"
              value={theme.font.weight.bold}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    weight: { ...theme.font.weight, bold: val },
                  },
                })
              }
            />
            <InputGroup
              label="半粗"
              value={theme.font.weight.semibold}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    weight: { ...theme.font.weight, semibold: val },
                  },
                })
              }
            />
            <InputGroup
              label="正常"
              value={theme.font.weight.normal}
              onChange={val =>
                updateTheme({
                  font: {
                    ...theme.font,
                    weight: { ...theme.font.weight, normal: val },
                  },
                })
              }
            />
          </div>
        </div>
      )}

      {activeTab === 'styles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 颜色 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <ColorInput
              label="主色"
              value={theme.color.primary}
              onChange={val =>
                updateTheme({
                  color: { ...theme.color, primary: val },
                })
              }
            />
            <ColorInput
              label="页面背景"
              value={theme.color.background.page}
              onChange={val =>
                updateTheme({
                  color: {
                    ...theme.color,
                    background: { ...theme.color.background, page: val },
                  },
                })
              }
            />
            <ColorInput
              label="主文字"
              value={theme.color.text.primary}
              onChange={val =>
                updateTheme({
                  color: {
                    ...theme.color,
                    text: { ...theme.color.text, primary: val },
                  },
                })
              }
            />
            <ColorInput
              label="次要文字"
              value={theme.color.text.secondary}
              onChange={val =>
                updateTheme({
                  color: {
                    ...theme.color,
                    text: { ...theme.color.text, secondary: val },
                  },
                })
              }
            />
            <ColorInput
              label="辅助文字"
              value={theme.color.text.tertiary}
              onChange={val =>
                updateTheme({
                  color: {
                    ...theme.color,
                    text: { ...theme.color.text, tertiary: val },
                  },
                })
              }
            />
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 间距 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <InputGroup
              label="页边距"
              value={theme.spacing.page}
              onChange={val =>
                updateTheme({
                  spacing: { ...theme.spacing, page: val },
                })
              }
            />
            <InputGroup
              label="章节间距"
              value={theme.spacing.section}
              onChange={val =>
                updateTheme({
                  spacing: { ...theme.spacing, section: val },
                })
              }
            />
            <InputGroup
              label="段落间距"
              value={theme.spacing.paragraph}
              onChange={val =>
                updateTheme({
                  spacing: { ...theme.spacing, paragraph: val },
                })
              }
            />
            <InputGroup
              label="条目间距"
              value={theme.spacing.item}
              onChange={val =>
                updateTheme({
                  spacing: { ...theme.spacing, item: val },
                })
              }
            />
            <InputGroup
              label="行间距"
              value={theme.spacing.line}
              onChange={val =>
                updateTheme({
                  spacing: { ...theme.spacing, line: val },
                })
              }
            />
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 视觉样式 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <BooleanInput
              label="章节分隔线"
              value={theme.style.showSectionDivider}
              onChange={val =>
                updateTheme({
                  style: { ...theme.style, showSectionDivider: val },
                })
              }
            />
            <BooleanInput
              label="个人信息分隔线"
              value={theme.style.showPersonalInfoDivider}
              onChange={val =>
                updateTheme({
                  style: { ...theme.style, showPersonalInfoDivider: val },
                })
              }
            />
            <BooleanInput
              label="Emoji图标"
              value={theme.style.useEmojiIcons}
              onChange={val =>
                updateTheme({
                  style: { ...theme.style, useEmojiIcons: val },
                })
              }
            />
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 分隔线设置 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <SelectInput
              label="分隔线样式"
              value={theme.style.dividerStyle}
              options={[
                { label: '实线', value: 'solid' },
                { label: '虚线', value: 'dashed' },
                { label: '点线', value: 'dotted' },
              ]}
              onChange={val =>
                updateTheme({
                  style: { ...theme.style, dividerStyle: val as any },
                })
              }
            />
            <InputGroup
              label="分隔线粗细"
              value={theme.style.dividerThickness}
              onChange={val =>
                updateTheme({
                  style: { ...theme.style, dividerThickness: val },
                })
              }
            />
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />

          {/* 布局 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <InputGroup
              label="行高"
              value={theme.layout.lineHeight}
              step={0.1}
              onChange={val =>
                updateTheme({
                  layout: { ...theme.layout, lineHeight: val },
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

const ThemeCard: React.FC<{
  theme: any
  active: boolean
  onClick: () => void
}> = ({ theme, active, onClick }) => {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 10px',
        border: `1px solid ${active ? '#2d2d2d' : hover ? '#e0e0e0' : 'transparent'}`,
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: active ? '#fafafa' : hover ? '#f8f8f8' : 'transparent',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: active ? '#2d2d2d' : '#000',
          marginBottom: '2px',
        }}
      >
        {theme.name}
      </div>
      <div
        style={{
          fontSize: '10px',
          color: '#999',
          lineHeight: '1.3',
        }}
      >
        {theme.description}
      </div>
    </div>
  )
}

const InputGroup: React.FC<{
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
}> = ({ label, value, onChange, step = 1 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label
        style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#666',
          minWidth: '45px',
        }}
      >
        {label}
      </label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          flex: 1,
          height: '28px',
          padding: '0 8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '11px',
          outline: 'none',
          backgroundColor: '#fafafa',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
        onFocus={e => {
          e.target.style.backgroundColor = '#fff'
          e.target.style.borderColor = '#888'
        }}
        onBlur={e => {
          e.target.style.backgroundColor = '#fafafa'
          e.target.style.borderColor = '#e0e0e0'
        }}
      />
    </div>
  )
}

const ColorInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
}> = ({ label, value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label
        style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#666',
          minWidth: '45px',
        }}
      >
        {label}
      </label>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '28px',
          height: '28px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1,
          height: '28px',
          padding: '0 8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '11px',
          outline: 'none',
          backgroundColor: '#fafafa',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
        onFocus={e => {
          e.target.style.backgroundColor = '#fff'
          e.target.style.borderColor = '#888'
        }}
        onBlur={e => {
          e.target.style.backgroundColor = '#fafafa'
          e.target.style.borderColor = '#e0e0e0'
        }}
      />
    </div>
  )
}

const BooleanInput: React.FC<{
  label: string
  value: boolean
  onChange: (value: boolean) => void
}> = ({ label, value, onChange }) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '5px 0',
      }}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        style={{
          width: '14px',
          height: '14px',
          cursor: 'pointer',
          accentColor: '#2d2d2d',
        }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#666',
        }}
      >
        {label}
      </span>
    </label>
  )
}

const SelectInput: React.FC<{
  label: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
}> = ({ label, value, options, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label
        style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#666',
          minWidth: '45px',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1,
          height: '28px',
          padding: '0 8px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          fontSize: '11px',
          outline: 'none',
          backgroundColor: '#fafafa',
          cursor: 'pointer',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
        onFocus={e => {
          e.currentTarget.style.backgroundColor = '#fff'
          e.currentTarget.style.borderColor = '#888'
        }}
        onBlur={e => {
          e.currentTarget.style.backgroundColor = '#fafafa'
          e.currentTarget.style.borderColor = '#e0e0e0'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
