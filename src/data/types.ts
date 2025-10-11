/**
 * 数据类型定义
 */

import type { PageSchema } from '@/types/material'

export interface ExampleResume {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  schema: PageSchema
}
