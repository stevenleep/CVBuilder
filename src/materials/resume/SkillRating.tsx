/**
 * 技能评级物料
 * 
 * 带熟练度评级的技能展示
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface SkillRatingProps {
  style?: React.CSSProperties
  skills?: string
  maxLevel?: number
  showDots?: boolean
}

const SkillRating: React.FC<SkillRatingProps> = ({ 
  style,
  skills = 'React,5|TypeScript,4|Node.js,4|Python,3',
  maxLevel = 5,
  showDots = true,
}) => {
  const theme = useThemeConfig()
  const skillArray = skills.split('|').map(s => {
    const [name, level] = s.split(',').map(v => v.trim())
    return { name, level: parseInt(level) || 0 }
  }).filter(s => s.name)
  
  return (
    <div style={{ marginBottom: `${theme.spacing.item}px`, ...style }}>
      {skillArray.map((skill, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: `${theme.spacing.line}px`,
            gap: '12px',
          }}
        >
          <span style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.primary,
            fontWeight: theme.font.weight.medium,
          }}>
            {skill.name}
          </span>
          
          {showDots && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: maxLevel }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: i < skill.level ? theme.color.text.primary : theme.color.border.normal,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const SkillRatingMaterial: IMaterialDefinition = {
  meta: {
    type: 'SkillRating',
    title: '技能评级',
    description: '带熟练度的技能展示',
    category: 'resume',
    tags: ['简历', '技能', '评级'],
    version: '1.0.0',
  },
  component: SkillRating,
  propsSchema: [
    {
      name: 'skills',
      label: '技能列表',
      type: 'textarea',
      defaultValue: 'React,5|TypeScript,4|Node.js,4|Python,3',
      description: '格式：技能,等级|技能,等级',
      required: true,
      group: '内容',
    },
    {
      name: 'maxLevel',
      label: '最高等级',
      type: 'number',
      defaultValue: 5,
      group: '样式',
    },
    {
      name: 'showDots',
      label: '显示圆点',
      type: 'boolean',
      defaultValue: true,
      group: '样式',
    },
  ],
  defaultProps: {
    skills: 'React,5|TypeScript,4|Node.js,4|Python,3',
    maxLevel: 5,
    showDots: true,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

