/**
 * 主题设置面板
 */

import React, { useState } from 'react'
import { useTheme } from '@/core/context/ThemeContext'
import { presetThemes } from '@/core/theme/themes'
import { Palette, Type, Layout, Sliders } from 'lucide-react'

export const ThemePanel: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { theme, setTheme, updateTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'fonts' | 'spacing'>('presets')

  return (
    <div style={{
      position: 'fixed',
      top: '56px',
      right: '0',
      width: '320px',
      height: 'calc(100vh - 56px)',
      backgroundColor: 'white',
      borderLeft: '1px solid #f1f1f1',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '-2px 0 8px rgba(0,0,0,0.04)',
    }}>
      {/* 标题 */}
      <div style={{ 
        padding: '16px',
        borderBottom: '1px solid #f1f1f1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ 
          fontSize: '14px',
          fontWeight: '600',
          color: '#000',
        }}>
          主题设置
        </div>
        <button
          onClick={onClose}
          style={{
            width: '24px',
            height: '24px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#999',
          }}
        >
          ×
        </button>
      </div>

      {/* 标签页 */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '12px',
        borderBottom: '1px solid #f1f1f1',
      }}>
        <TabButton
          icon={<Palette size={14} />}
          label="预设"
          active={activeTab === 'presets'}
          onClick={() => setActiveTab('presets')}
        />
        <TabButton
          icon={<Type size={14} />}
          label="字体"
          active={activeTab === 'fonts'}
          onClick={() => setActiveTab('fonts')}
        />
        <TabButton
          icon={<Sliders size={14} />}
          label="颜色"
          active={activeTab === 'colors'}
          onClick={() => setActiveTab('colors')}
        />
        <TabButton
          icon={<Layout size={14} />}
          label="间距"
          active={activeTab === 'spacing'}
          onClick={() => setActiveTab('spacing')}
        />
      </div>

      {/* 内容 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
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
              label="标题字号"
              value={theme.font.titleSize.h1}
              onChange={(val) => updateTheme({
                font: { 
                  ...theme.font,
                  titleSize: { ...theme.font.titleSize, h1: val }
                }
              })}
            />
            <InputGroup
              label="章节字号"
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
      </div>
    </div>
  )
}

const TabButton: React.FC<{
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: active ? '#fafafa' : 'transparent',
        color: active ? '#000' : '#999',
        fontSize: '11px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.1s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

const ThemeCard: React.FC<{
  theme: ITheme
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

