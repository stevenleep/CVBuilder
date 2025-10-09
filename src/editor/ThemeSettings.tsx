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
  const [activeTab, setActiveTab] = useState<'presets' | 'fonts' | 'colors' | 'spacing' | 'styles'>('presets')

  return (
    <div style={{ padding: '16px' }}>
      {/* Tab导航 */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '16px',
        backgroundColor: '#fafafa',
        padding: '3px',
        borderRadius: '4px',
      }}>
        {[
          { id: 'presets', label: '预设' },
          { id: 'fonts', label: '字体' },
          { id: 'colors', label: '颜色' },
          { id: 'spacing', label: '间距' },
          { id: 'styles', label: '样式' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              height: '26px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#999',
              transition: 'all 0.1s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      {activeTab === 'presets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <InputGroup
            label="主标题字号"
            value={theme.font.titleSize.h1}
            onChange={(val) => updateTheme({
              font: { 
                ...theme.font,
                titleSize: { ...theme.font.titleSize, h1: val }
              }
            })}
          />
          <InputGroup
            label="章节标题字号"
            value={theme.font.titleSize.h2}
            onChange={(val) => updateTheme({
              font: { 
                ...theme.font,
                titleSize: { ...theme.font.titleSize, h2: val }
              }
            })}
          />
          <InputGroup
            label="正文字号"
            value={theme.font.bodySize.normal}
            onChange={(val) => updateTheme({
              font: { 
                ...theme.font,
                bodySize: { ...theme.font.bodySize, normal: val }
              }
            })}
          />
        </div>
      )}

      {activeTab === 'colors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ColorInput
            label="主色调"
            value={theme.color.primary}
            onChange={(val) => updateTheme({
              color: { ...theme.color, primary: val }
            })}
          />
          <ColorInput
            label="主要文字"
            value={theme.color.text.primary}
            onChange={(val) => updateTheme({
              color: { 
                ...theme.color,
                text: { ...theme.color.text, primary: val }
              }
            })}
          />
          <ColorInput
            label="次要文字"
            value={theme.color.text.secondary}
            onChange={(val) => updateTheme({
              color: { 
                ...theme.color,
                text: { ...theme.color.text, secondary: val }
              }
            })}
          />
        </div>
      )}

      {activeTab === 'spacing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <InputGroup
            label="页面边距"
            value={theme.spacing.page}
            onChange={(val) => updateTheme({
              spacing: { ...theme.spacing, page: val }
            })}
          />
          <InputGroup
            label="章节间距"
            value={theme.spacing.section}
            onChange={(val) => updateTheme({
              spacing: { ...theme.spacing, section: val }
            })}
          />
          <InputGroup
            label="条目间距"
            value={theme.spacing.item}
            onChange={(val) => updateTheme({
              spacing: { ...theme.spacing, item: val }
            })}
          />
        </div>
      )}

      {activeTab === 'styles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <BooleanInput
            label="显示章节分隔线"
            value={theme.style.showSectionDivider}
            onChange={(val) => updateTheme({
              style: { ...theme.style, showSectionDivider: val }
            })}
          />
          <BooleanInput
            label="显示个人信息分隔线"
            value={theme.style.showPersonalInfoDivider}
            onChange={(val) => updateTheme({
              style: { ...theme.style, showPersonalInfoDivider: val }
            })}
          />
          <BooleanInput
            label="使用Emoji图标"
            value={theme.style.useEmojiIcons}
            onChange={(val) => updateTheme({
              style: { ...theme.style, useEmojiIcons: val }
            })}
          />
          <SelectInput
            label="分隔线样式"
            value={theme.style.dividerStyle}
            options={[
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' },
            ]}
            onChange={(val) => updateTheme({
              style: { ...theme.style, dividerStyle: val as any }
            })}
          />
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
        padding: '12px',
        border: `1px solid ${active ? '#000' : '#f1f1f1'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: hover ? '#fafafa' : 'white',
        transition: 'all 0.1s',
      }}
    >
      <div style={{ 
        fontSize: '13px',
        fontWeight: '600',
        color: '#000',
        marginBottom: '4px',
      }}>
        {theme.name}
      </div>
      <div style={{ 
        fontSize: '11px',
        color: '#999',
      }}>
        {theme.description}
      </div>
    </div>
  )
}

const InputGroup: React.FC<{
  label: string
  value: number
  onChange: (value: number) => void
}> = ({ label, value, onChange }) => {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#666',
      }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: '30px',
          padding: '0 10px',
          border: '1px solid #f1f1f1',
          borderRadius: '4px',
          fontSize: '12px',
          outline: 'none',
          backgroundColor: '#fafafa',
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
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#666',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '30px',
            height: '30px',
            border: '1px solid #f1f1f1',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            height: '30px',
            padding: '0 10px',
            border: '1px solid #f1f1f1',
            borderRadius: '4px',
            fontSize: '12px',
            outline: 'none',
            backgroundColor: '#fafafa',
          }}
        />
      </div>
    </div>
  )
}

const BooleanInput: React.FC<{
  label: string
  value: boolean
  onChange: (value: boolean) => void
}> = ({ label, value, onChange }) => {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '6px 0',
    }}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '16px',
          height: '16px',
          cursor: 'pointer',
          accentColor: '#000',
        }}
      />
      <span style={{
        fontSize: '12px',
        fontWeight: '500',
        color: '#666',
      }}>
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
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#666',
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '30px',
          padding: '0 10px',
          border: '1px solid #f1f1f1',
          borderRadius: '4px',
          fontSize: '12px',
          outline: 'none',
          backgroundColor: '#fafafa',
          cursor: 'pointer',
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

