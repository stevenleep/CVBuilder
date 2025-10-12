/**
 * 技能雷达图物料示例
 *
 * 专门用于展示技能评分的雷达图组件
 * 比通用图表物料更专注和优化
 */

import React, { useMemo } from 'react'
import type { IMaterialDefinition } from '../../src/core'

// 物料Props类型
interface IMaterialProps<T = any> {
  data?: T
  theme?: any
  materialContext?: any
}

/**
 * 技能项
 */
interface SkillItem {
  name: string
  level: number
  category?: string
}

/**
 * 技能雷达图配置
 */
interface SkillRadarConfig {
  title?: string
  skills: SkillItem[]
  maxLevel: number
  size: number
  showGrid: boolean
  gridLevels: number
  showLabels: boolean
  showValues: boolean
  colorScheme: 'blue' | 'green' | 'purple' | 'gradient'
  fillOpacity: number
  lineWidth: number
}

/**
 * 技能雷达图组件
 */
const SkillRadarMaterial: React.FC<IMaterialProps<SkillRadarConfig>> = ({ data, theme }) => {
  const config = data || {
    title: '技能雷达图',
    skills: [
      { name: '前端开发', level: 90, category: '技术' },
      { name: '后端开发', level: 75, category: '技术' },
      { name: '数据库', level: 80, category: '技术' },
      { name: '团队协作', level: 85, category: '软技能' },
      { name: '项目管理', level: 70, category: '软技能' },
      { name: '沟通能力', level: 88, category: '软技能' },
    ],
    maxLevel: 100,
    size: 400,
    showGrid: true,
    gridLevels: 5,
    showLabels: true,
    showValues: true,
    colorScheme: 'blue',
    fillOpacity: 0.3,
    lineWidth: 2,
  }

  // 颜色方案
  const colors = useMemo(() => {
    const schemes = {
      blue: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        gradient: ['#3b82f6', '#2563eb'],
      },
      green: {
        primary: '#10b981',
        secondary: '#34d399',
        gradient: ['#10b981', '#059669'],
      },
      purple: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        gradient: ['#8b5cf6', '#7c3aed'],
      },
      gradient: {
        primary: '#3b82f6',
        secondary: '#10b981',
        gradient: ['#3b82f6', '#10b981', '#f59e0b'],
      },
    }
    return schemes[config.colorScheme] || schemes.blue
  }, [config.colorScheme])

  // 计算雷达图参数
  const radarParams = useMemo(() => {
    const centerX = config.size / 2
    const centerY = config.size / 2
    const radius = (config.size / 2) * 0.7
    const angleStep = (Math.PI * 2) / config.skills.length

    return {
      centerX,
      centerY,
      radius,
      angleStep,
    }
  }, [config.size, config.skills.length])

  // 计算技能点坐标
  const skillPoints = useMemo(() => {
    const { centerX, centerY, radius, angleStep } = radarParams

    return config.skills.map((skill, index) => {
      const angle = index * angleStep - Math.PI / 2
      const levelRatio = skill.level / config.maxLevel
      const distance = radius * levelRatio

      return {
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
        labelX: centerX + (radius + 40) * Math.cos(angle),
        labelY: centerY + (radius + 40) * Math.sin(angle),
        skill,
        angle,
      }
    })
  }, [config.skills, config.maxLevel, radarParams])

  // 生成网格路径
  const generateGridPaths = () => {
    const { centerX, centerY, radius, angleStep } = radarParams
    const paths: React.ReactElement[] = []

    for (let level = 1; level <= config.gridLevels; level++) {
      const levelRadius = (radius / config.gridLevels) * level
      const points: string[] = []

      for (let i = 0; i <= config.skills.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        const x = centerX + levelRadius * Math.cos(angle)
        const y = centerY + levelRadius * Math.sin(angle)
        points.push(`${x},${y}`)
      }

      paths.push(
        <polygon
          key={level}
          points={points.join(' ')}
          fill="none"
          stroke={theme?.colors?.border || '#e5e7eb'}
          strokeWidth="1"
          opacity={0.5}
        />
      )
    }

    return paths
  }

  // 生成轴线
  const generateAxisLines = () => {
    const { centerX, centerY } = radarParams

    return skillPoints.map((point, index) => (
      <line
        key={index}
        x1={centerX}
        y1={centerY}
        x2={point.labelX}
        y2={point.labelY}
        stroke={theme?.colors?.border || '#e5e7eb'}
        strokeWidth="1"
        opacity={0.5}
      />
    ))
  }

  // 生成数据多边形
  const generateDataPolygon = () => {
    const points = skillPoints.map(p => `${p.x},${p.y}`).join(' ')

    return (
      <g>
        {/* 填充 */}
        <polygon points={points} fill={`url(#skill-gradient)`} opacity={config.fillOpacity} />
        {/* 边框 */}
        <polygon
          points={points}
          fill="none"
          stroke={colors.primary}
          strokeWidth={config.lineWidth}
          strokeLinejoin="round"
        />
      </g>
    )
  }

  // 生成渐变定义
  const generateGradient = () => {
    const gradientColors = colors.gradient

    return (
      <defs>
        <linearGradient id="skill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          {gradientColors.map((color, index) => (
            <stop
              key={index}
              offset={`${(index / (gradientColors.length - 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
    )
  }

  // 技能分类统计
  const categoryStats = useMemo(() => {
    const stats = new Map<string, { total: number; count: number }>()

    config.skills.forEach(skill => {
      const category = skill.category || '其他'
      const current = stats.get(category) || { total: 0, count: 0 }
      stats.set(category, {
        total: current.total + skill.level,
        count: current.count + 1,
      })
    })

    return Array.from(stats.entries()).map(([category, data]) => ({
      category,
      average: Math.round(data.total / data.count),
    }))
  }, [config.skills])

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '24px',
        backgroundColor: theme?.colors?.background || '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* 标题 */}
      {config.title && (
        <h3
          style={{
            margin: 0,
            fontSize: theme?.font?.titleSize?.h3 || '18px',
            fontWeight: 700,
            color: theme?.colors?.text || '#333',
          }}
        >
          {config.title}
        </h3>
      )}

      {/* 雷达图 */}
      <svg width={config.size} height={config.size}>
        {generateGradient()}

        {/* 网格 */}
        {config.showGrid && generateGridPaths()}

        {/* 轴线 */}
        {generateAxisLines()}

        {/* 数据多边形 */}
        {generateDataPolygon()}

        {/* 数据点和标签 */}
        {skillPoints.map((point, index) => {
          const textAnchor =
            Math.abs(point.angle) < Math.PI / 4 || Math.abs(point.angle) > (Math.PI * 3) / 4
              ? point.angle < 0
                ? 'start'
                : point.angle > 0
                  ? 'end'
                  : 'middle'
              : 'middle'

          return (
            <g key={index}>
              {/* 数据点 */}
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={colors.primary}
                stroke="#fff"
                strokeWidth="2"
              />

              {/* 数值标签 */}
              {config.showValues && (
                <text
                  x={point.x}
                  y={point.y - 12}
                  fontSize="12"
                  fontWeight="600"
                  fill={colors.primary}
                  textAnchor="middle"
                >
                  {point.skill.level}
                </text>
              )}

              {/* 技能名称 */}
              {config.showLabels && (
                <text
                  x={point.labelX}
                  y={point.labelY}
                  fontSize="13"
                  fontWeight="500"
                  fill={theme?.colors?.text || '#333'}
                  textAnchor={textAnchor}
                >
                  {point.skill.name}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* 分类统计 */}
      {categoryStats.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {categoryStats.map((stat, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 20px',
                backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: theme?.colors?.textSecondary || '#666',
                  marginBottom: '4px',
                }}
              >
                {stat.category}
              </span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                {stat.average}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: theme?.colors?.textSecondary || '#999',
                }}
              >
                平均分
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 图例 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
          borderRadius: '16px',
          fontSize: '12px',
          color: theme?.colors?.textSecondary || '#666',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: colors.primary,
            borderRadius: '2px',
          }}
        />
        <span>满分: {config.maxLevel}</span>
      </div>
    </div>
  )
}

/**
 * 物料定义
 */
export const SkillRadarMaterialDefinition: IMaterialDefinition = {
  meta: {
    type: 'SkillRadar',
    title: '技能雷达图',
    category: 'visualization',
    description: '专业的技能评分雷达图，支持分类和统计',
    icon: 'radar',
    tags: ['技能', '雷达图', '评分', '可视化'],
    version: '1.0.0',
  },
  component: SkillRadarMaterial,
  propsSchema: [
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '技能雷达图',
      group: '基本',
    },
    {
      name: 'skills',
      label: '技能列表',
      type: 'array',
      defaultValue: [
        { name: '前端开发', level: 90, category: '技术' },
        { name: '后端开发', level: 75, category: '技术' },
        { name: '数据库', level: 80, category: '技术' },
      ],
      group: '数据',
    },
    {
      name: 'maxLevel',
      label: '满分',
      type: 'number',
      defaultValue: 100,
      group: '基本',
    },
    {
      name: 'size',
      label: '尺寸',
      type: 'number',
      defaultValue: 400,
      group: '样式',
    },
    {
      name: 'colorScheme',
      label: '配色方案',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: '蓝色', value: 'blue' },
        { label: '绿色', value: 'green' },
        { label: '紫色', value: 'purple' },
        { label: '渐变', value: 'gradient' },
      ],
      group: '样式',
    },
    {
      name: 'fillOpacity',
      label: '填充透明度',
      type: 'number',
      defaultValue: 0.3,
      group: '样式',
    },
    {
      name: 'lineWidth',
      label: '线条宽度',
      type: 'number',
      defaultValue: 2,
      group: '样式',
    },
    {
      name: 'showGrid',
      label: '显示网格',
      type: 'boolean',
      defaultValue: true,
      group: '显示',
    },
    {
      name: 'gridLevels',
      label: '网格层数',
      type: 'number',
      defaultValue: 5,
      group: '显示',
    },
    {
      name: 'showLabels',
      label: '显示标签',
      type: 'boolean',
      defaultValue: true,
      group: '显示',
    },
    {
      name: 'showValues',
      label: '显示数值',
      type: 'boolean',
      defaultValue: true,
      group: '显示',
    },
  ],
  capabilities: {},
  defaultProps: {
    title: '技能雷达图',
    skills: [
      { name: '前端开发', level: 90, category: '技术' },
      { name: '后端开发', level: 75, category: '技术' },
      { name: '数据库', level: 80, category: '技术' },
      { name: '团队协作', level: 85, category: '软技能' },
      { name: '项目管理', level: 70, category: '软技能' },
      { name: '沟通能力', level: 88, category: '软技能' },
    ],
    maxLevel: 100,
    size: 400,
    showGrid: true,
    gridLevels: 5,
    showLabels: true,
    showValues: true,
    colorScheme: 'blue',
    fillOpacity: 0.3,
    lineWidth: 2,
  },
}

/**
 * 使用示例：
 *
 * ```typescript
 * import { materialRegistry } from '@/core'
 * import { SkillRadarMaterialDefinition } from './examples/materials/SkillRadarMaterial'
 *
 * // 注册物料
 * materialRegistry.register(SkillRadarMaterialDefinition)
 *
 * // 使用物料
 * <SkillRadarMaterial
 *   data={{
 *     skills: [
 *       { name: 'JavaScript', level: 95, category: '前端' },
 *       { name: 'React', level: 90, category: '前端' },
 *       { name: 'Node.js', level: 85, category: '后端' },
 *       { name: 'SQL', level: 80, category: '数据库' },
 *     ],
 *     colorScheme: 'gradient',
 *   }}
 * />
 * ```
 */
