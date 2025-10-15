/**
 * 通用工具
 */

import { nanoid } from 'nanoid'
import type { PageSchema } from '../../types/material'

export function createDefaultPageSchema(): PageSchema {
  return {
    version: '1.0.0',
    meta: {
      title: '我的简历',
      description: '使用简历构建器创建',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
    root: {
      id: nanoid(),
      type: 'Page',
      props: {},
      style: {},
      children: [],
    },
  }
}

/** 深拷贝 - structuredClone优先(快2-3倍)，降级到JSON */
export function safeDeepClone<T>(obj: T): T {
  try {
    return structuredClone(obj)
  } catch {
    return JSON.parse(JSON.stringify(obj))
  }
}
