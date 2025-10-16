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
    <div style={{ padding: '0' }}>
      {/* Tab导航 - 与PropertyPanel保持一致 */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginBottom: '12px',
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
              flex: '1 1 0',
              minWidth: 0,
              height: '32px',
              padding: '0 8px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: activeTab === tab.id ? '#2d2d2d' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#666',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
                e.currentTarget.style.color = '#1a1a1a'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#666'
              }
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 字体族 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{ fontSize: '13px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}
            >
              字体设置
            </div>
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
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e9ecef', margin: '4px 0' }} />

          {/* 标题字号 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{ fontSize: '13px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}
            >
              标题字号
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e9ecef', margin: '4px 0' }} />

          {/* 正文字号 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{ fontSize: '13px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}
            >
              正文字号
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', backgroundColor: '#e9ecef', margin: '4px 0' }} />

          {/* 字重 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{ fontSize: '13px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}
            >
              字重设置
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
        </div>
      )}

      {activeTab === 'styles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        border: `1px solid ${active ? '#2d2d2d' : hover ? '#e8e8e8' : 'transparent'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: active ? '#ffffff' : hover ? '#fafafa' : 'transparent',
        transition: 'all 0.2s ease',
        boxShadow: active
          ? '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
          : hover
            ? '0 1px 4px rgba(0,0,0,0.04)'
            : 'none',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#000',
          marginBottom: '4px',
        }}
      >
        {theme.name}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#999',
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
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#555',
          letterSpacing: '0.2px',
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
          width: '100%',
          height: '36px',
          padding: '0 14px',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          fontSize: '13px',
          outline: 'none',
          backgroundColor: '#fafafa',
          color: '#1a1a1a',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
        onFocus={e => {
          e.target.style.backgroundColor = '#fff'
          e.target.style.borderColor = '#b0b0b0'
          e.target.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.08), 0 2px 6px rgba(0,0,0,0.06)'
        }}
        onBlur={e => {
          e.target.style.backgroundColor = '#fafafa'
          e.target.style.borderColor = '#e0e0e0'
          e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'
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
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#555',
          letterSpacing: '0.2px',
        }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #e8e8e8',
            borderRadius: '10px',
            cursor: 'pointer',
            padding: '3px',
            backgroundColor: '#fafafa',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            transition: 'all 0.15s',
          }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1,
            height: '36px',
            padding: '0 14px',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            fontSize: '13px',
            outline: 'none',
            backgroundColor: '#fafafa',
            color: '#1a1a1a',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
          onFocus={e => {
            e.target.style.backgroundColor = '#fff'
            e.target.style.borderColor = '#b0b0b0'
            e.target.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.08), 0 2px 6px rgba(0,0,0,0.06)'
          }}
          onBlur={e => {
            e.target.style.backgroundColor = '#fafafa'
            e.target.style.borderColor = '#e0e0e0'
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'
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
}> = ({ value, onChange }) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        height: '32px',
        padding: '0 12px',
        backgroundColor: '#fafafa',
        border: '1px solid #e8e8e8',
        borderRadius: '10px',
        transition: 'all 0.15s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#fff'
        e.currentTarget.style.borderColor = '#d0d0d0'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#fafafa'
        e.currentTarget.style.borderColor = '#e8e8e8'
      }}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        style={{
          width: '16px',
          height: '16px',
          cursor: 'pointer',
          accentColor: '#2d2d2d',
        }}
      />
      <span style={{ fontSize: '12px', color: '#2d2d2d', fontWeight: '500' }}>启用</span>
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
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#555',
          letterSpacing: '0.2px',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '36px',
          padding: '0 14px',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          fontSize: '13px',
          outline: 'none',
          backgroundColor: '#fafafa',
          color: '#1a1a1a',
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          paddingRight: '30px',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          appearance: 'none',
        }}
        onFocus={e => {
          e.currentTarget.style.backgroundColor = '#fff'
          e.currentTarget.style.borderColor = '#b0b0b0'
          e.currentTarget.style.boxShadow =
            '0 0 0 3px rgba(45,45,45,0.08), 0 2px 6px rgba(0,0,0,0.06)'
        }}
        onBlur={e => {
          e.currentTarget.style.backgroundColor = '#fafafa'
          e.currentTarget.style.borderColor = '#e0e0e0'
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'
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
