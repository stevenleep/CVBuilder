/**
 * 示例简历索引
 *
 * 汇总所有行业的示例简历
 */

import type { ExampleResume } from '@/data/types'
import { techEngineerExample } from './techEngineer'
import { backendEngineerExample } from './backendEngineer'
import { productManagerExample } from './productManager'
import { uiDesignerExample } from './uiDesigner'
import { dataAnalystExample } from './dataAnalyst'
import { marketingManagerExample } from './marketingManager'
import { hrManagerExample } from './hrManager'
import { salesManagerExample } from './salesManager'
import { operationsManagerExample } from './operationsManager'
import { contentWriterExample } from './contentWriter'
import { projectManagerExample } from './projectManager'
import { feishuStyleExample } from './feishuStyle'

// 导出所有示例简历
export const exampleResumes: ExampleResume[] = [
  techEngineerExample,
  backendEngineerExample,
  productManagerExample,
  uiDesignerExample,
  dataAnalystExample,
  marketingManagerExample,
  salesManagerExample,
  operationsManagerExample,
  contentWriterExample,
  hrManagerExample,
  projectManagerExample,
  feishuStyleExample,
]

// 根据分类获取示例
export const getExamplesByCategory = (category: string): ExampleResume[] => {
  if (category === 'all') return exampleResumes
  return exampleResumes.filter(example => example.category === category)
}

// 获取所有分类
export const getCategories = (): string[] => {
  const categories = new Set(exampleResumes.map(ex => ex.category))
  return Array.from(categories)
}

// 根据ID获取示例
export const getExampleById = (id: string): ExampleResume | undefined => {
  return exampleResumes.find(example => example.id === id)
}

// 按分类分组
export const getExamplesGroupedByCategory = (): Record<string, ExampleResume[]> => {
  const grouped: Record<string, ExampleResume[]> = {}

  exampleResumes.forEach(example => {
    if (!grouped[example.category]) {
      grouped[example.category] = []
    }
    grouped[example.category].push(example)
  })

  return grouped
}
