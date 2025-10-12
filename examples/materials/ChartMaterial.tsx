/**
 * 图表物料示例
 *
 * 展示如何创建一个可配置的图表组件
 * 支持柱状图、折线图、饼图等多种类型
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
 * 图表数据项
 */
interface ChartDataItem {
  label: string
  value: number
  color?: string
}

/**
 * 图表配置
 */
interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'radar'
  title?: string
  width: number
  height: number
  data: ChartDataItem[]
  showLegend: boolean
  showValues: boolean
  colors: string[]
  backgroundColor?: string
}

/**
 * 图表组件
 */
const ChartMaterial: React.FC<IMaterialProps<ChartConfig>> = ({ data, theme }) => {
  const config = data || {
    type: 'bar',
    title: '技能评分',
    width: 400,
    height: 300,
    data: [
      { label: 'JavaScript', value: 90 },
      { label: 'TypeScript', value: 85 },
      { label: 'React', value: 88 },
      { label: 'Node.js', value: 80 },
      { label: 'Python', value: 75 },
    ],
    showLegend: true,
    showValues: true,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  }

  // 计算图表数据
  const chartData = useMemo(() => {
    return config.data.map((item, index) => ({
      ...item,
      color: item.color || config.colors[index % config.colors.length],
    }))
  }, [config.data, config.colors])

  // 计算最大值（用于缩放）
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(item => item.value), 100)
  }, [chartData])

  // 渲染不同类型的图表
  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return renderBarChart()
      case 'line':
        return renderLineChart()
      case 'pie':
        return renderPieChart()
      case 'radar':
        return renderRadarChart()
      default:
        return renderBarChart()
    }
  }

  // 渲染柱状图
  const renderBarChart = () => {
    const barWidth = (config.width - 60) / chartData.length - 10

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          height: config.height - 60,
          gap: '10px',
          paddingLeft: '40px',
        }}
      >
        {chartData.map((item, index) => {
          const height = (item.value / maxValue) * (config.height - 80)

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {config.showValues && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: theme?.colors?.text || '#333',
                  }}
                >
                  {item.value}
                </span>
              )}
              <div
                style={{
                  width: `${barWidth}px`,
                  height: `${height}px`,
                  backgroundColor: item.color,
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease',
                }}
                title={`${item.label}: ${item.value}`}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: theme?.colors?.textSecondary || '#666',
                  maxWidth: `${barWidth}px`,
                  textAlign: 'center',
                  wordWrap: 'break-word',
                }}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // 渲染折线图
  const renderLineChart = () => {
    const points = chartData.map((item, index) => {
      const x = 40 + (index / (chartData.length - 1)) * (config.width - 80)
      const y = config.height - 60 - (item.value / maxValue) * (config.height - 100)
      return { x, y, ...item }
    })

    const pathD = points
      .map((point, index) => {
        return index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
      })
      .join(' ')

    return (
      <svg width={config.width} height={config.height - 40} style={{ overflow: 'visible' }}>
        {/* 网格线 */}
        {[0, 25, 50, 75, 100].map((value, index) => {
          const y = config.height - 60 - (value / maxValue) * (config.height - 100)
          return (
            <g key={index}>
              <line
                x1={40}
                y1={y}
                x2={config.width - 40}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text x={10} y={y + 4} fontSize="10" fill="#9ca3af">
                {value}
              </text>
            </g>
          )
        })}

        {/* 折线 */}
        <path
          d={pathD}
          fill="none"
          stroke={chartData[0]?.color || '#3b82f6'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={point.color}
              stroke="#fff"
              strokeWidth="2"
            />
            {config.showValues && (
              <text
                x={point.x}
                y={point.y - 12}
                fontSize="11"
                fontWeight="600"
                fill={theme?.colors?.text || '#333'}
                textAnchor="middle"
              >
                {point.value}
              </text>
            )}
            <text
              x={point.x}
              y={config.height - 40}
              fontSize="10"
              fill={theme?.colors?.textSecondary || '#666'}
              textAnchor="middle"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    )
  }

  // 渲染饼图
  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0)
    const centerX = config.width / 2
    const centerY = (config.height - 40) / 2
    const radius = Math.min(config.width, config.height - 40) / 2 - 40

    let currentAngle = -90

    const slices = chartData.map(item => {
      const percentage = (item.value / total) * 100
      const angle = (percentage / 100) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle

      const start = polarToCartesian(centerX, centerY, radius, startAngle)
      const end = polarToCartesian(centerX, centerY, radius, endAngle)

      const largeArcFlag = angle > 180 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        'Z',
      ].join(' ')

      currentAngle = endAngle

      return {
        pathData,
        color: item.color,
        label: item.label,
        value: item.value,
        percentage: percentage.toFixed(1),
        midAngle: (startAngle + endAngle) / 2,
      }
    })

    return (
      <svg width={config.width} height={config.height - 40}>
        {slices.map((slice, index) => {
          const labelPos = polarToCartesian(centerX, centerY, radius + 20, slice.midAngle)

          return (
            <g key={index}>
              <path d={slice.pathData} fill={slice.color} opacity={0.9} />
              {config.showValues && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fontSize="11"
                  fontWeight="600"
                  fill={theme?.colors?.text || '#333'}
                  textAnchor="middle"
                >
                  {slice.percentage}%
                </text>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  // 渲染雷达图
  const renderRadarChart = () => {
    const centerX = config.width / 2
    const centerY = (config.height - 40) / 2
    const radius = Math.min(config.width, config.height - 40) / 2 - 60
    const levels = 5

    // 计算多边形顶点
    const points = chartData.map((item, index) => {
      const angle = (index / chartData.length) * Math.PI * 2 - Math.PI / 2
      const value = (item.value / maxValue) * radius
      return {
        x: centerX + value * Math.cos(angle),
        y: centerY + value * Math.sin(angle),
        labelX: centerX + (radius + 30) * Math.cos(angle),
        labelY: centerY + (radius + 30) * Math.sin(angle),
        ...item,
      }
    })

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

    return (
      <svg width={config.width} height={config.height - 40}>
        {/* 背景网格 */}
        {Array.from({ length: levels }).map((_, i) => {
          const levelRadius = (radius / levels) * (i + 1)
          const levelPoints = chartData.map((_, index) => {
            const angle = (index / chartData.length) * Math.PI * 2 - Math.PI / 2
            return {
              x: centerX + levelRadius * Math.cos(angle),
              y: centerY + levelRadius * Math.sin(angle),
            }
          })

          return (
            <polygon
              key={i}
              points={levelPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        {/* 轴线 */}
        {points.map((point, index) => (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={point.labelX}
            y2={point.labelY}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* 数据多边形 */}
        <polygon
          points={polygonPoints}
          fill={chartData[0]?.color || '#3b82f6'}
          opacity={0.3}
          stroke={chartData[0]?.color || '#3b82f6'}
          strokeWidth="2"
        />

        {/* 数据点和标签 */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={point.color}
              stroke="#fff"
              strokeWidth="2"
            />
            {config.showValues && (
              <text
                x={point.x}
                y={point.y - 10}
                fontSize="11"
                fontWeight="600"
                fill={theme?.colors?.text || '#333'}
                textAnchor="middle"
              >
                {point.value}
              </text>
            )}
            <text
              x={point.labelX}
              y={point.labelY}
              fontSize="11"
              fill={theme?.colors?.textSecondary || '#666'}
              textAnchor="middle"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    )
  }

  // 极坐标转直角坐标
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  return (
    <div
      style={{
        width: config.width,
        padding: '20px',
        backgroundColor: config.backgroundColor || theme?.colors?.background || '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {config.title && (
        <h3
          style={{
            margin: '0 0 20px 0',
            fontSize: theme?.font?.titleSize?.h3 || '16px',
            fontWeight: 600,
            color: theme?.colors?.text || '#333',
            textAlign: 'center',
          }}
        >
          {config.title}
        </h3>
      )}

      {renderChart()}

      {config.showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '20px',
            justifyContent: 'center',
          }}
        >
          {chartData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: item.color,
                  borderRadius: '2px',
                }}
              />
              <span style={{ fontSize: '11px', color: theme?.colors?.textSecondary || '#666' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 物料定义
 */
export const ChartMaterialDefinition: IMaterialDefinition = {
  meta: {
    type: 'Chart',
    title: '图表',
    category: 'visualization',
    description: '可配置的图表组件，支持柱状图、折线图、饼图、雷达图',
    icon: 'bar-chart',
    tags: ['图表', '可视化', '数据', '统计'],
    version: '1.0.0',
  },
  component: ChartMaterial,
  propsSchema: [
    {
      name: 'type',
      label: '图表类型',
      type: 'select',
      defaultValue: 'bar',
      options: [
        { label: '柱状图', value: 'bar' },
        { label: '折线图', value: 'line' },
        { label: '饼图', value: 'pie' },
        { label: '雷达图', value: 'radar' },
      ],
      group: '基本',
    },
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '技能评分',
      group: '基本',
    },
    {
      name: 'width',
      label: '宽度',
      type: 'number',
      defaultValue: 400,
      group: '尺寸',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
      defaultValue: 300,
      group: '尺寸',
    },
    {
      name: 'data',
      label: '数据',
      type: 'array',
      defaultValue: [
        { label: 'JavaScript', value: 90 },
        { label: 'TypeScript', value: 85 },
        { label: 'React', value: 88 },
      ],
      group: '数据',
    },
    {
      name: 'showLegend',
      label: '显示图例',
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
    {
      name: 'colors',
      label: '颜色方案',
      type: 'json',
      defaultValue: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      group: '样式',
    },
    {
      name: 'backgroundColor',
      label: '背景颜色',
      type: 'color',
      defaultValue: '#ffffff',
      group: '样式',
    },
  ],
  capabilities: {},
  defaultProps: {
    type: 'bar',
    title: '技能评分',
    width: 400,
    height: 300,
    data: [
      { label: 'JavaScript', value: 90 },
      { label: 'TypeScript', value: 85 },
      { label: 'React', value: 88 },
      { label: 'Node.js', value: 80 },
      { label: 'Python', value: 75 },
    ],
    showLegend: true,
    showValues: true,
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  },
}

/**
 * 使用示例：
 *
 * ```typescript
 * import { materialRegistry } from '@/core'
 * import { ChartMaterialDefinition } from './examples/materials/ChartMaterial'
 *
 * // 注册物料
 * materialRegistry.register(ChartMaterialDefinition)
 * ```
 */
