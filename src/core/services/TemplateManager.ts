/**
 * 模板管理器
 * 
 * 管理用户自定义的组件模板
 */

import { NodeSchema } from '@/types/material'
import { nanoid } from 'nanoid'
import { indexedDBService, STORES } from '@/utils/indexedDB'

export interface CustomTemplate {
  id: string
  name: string
  description?: string
  category: string
  schema: NodeSchema
  thumbnail?: string
  createTime: string
}

class TemplateManager {
  private static instance: TemplateManager
  private templates: Map<string, CustomTemplate> = new Map()
  private storageKey = 'resume-builder-templates'

  private constructor() {
    this.loadFromStorage().catch(err => {
      console.error('[TemplateManager] 初始化加载失败:', err)
    })
  }

  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager()
    }
    return TemplateManager.instance
  }

  /**
   * 保存节点为模板
   */
  public saveAsTemplate(
    schema: NodeSchema,
    name: string,
    description?: string,
    category: string = 'custom'
  ): CustomTemplate {
    const template: CustomTemplate = {
      id: nanoid(),
      name,
      description,
      category,
      schema: JSON.parse(JSON.stringify(schema)), // 深拷贝
      createTime: new Date().toISOString(),
    }

    this.templates.set(template.id, template)
    this.saveToStorage()

    console.log('[TemplateManager] 保存模板:', template.name)
    return template
  }

  /**
   * 获取所有模板
   */
  public getAllTemplates(): CustomTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * 按分类获取模板
   */
  public getTemplatesByCategory(category: string): CustomTemplate[] {
    return this.getAllTemplates().filter(t => t.category === category)
  }

  /**
   * 获取模板
   */
  public getTemplate(id: string): CustomTemplate | undefined {
    return this.templates.get(id)
  }

  /**
   * 删除模板
   */
  public deleteTemplate(id: string): void {
    this.templates.delete(id)
    this.saveToStorage()
    console.log('[TemplateManager] 删除模板:', id)
  }

  /**
   * 重命名模板
   */
  public renameTemplate(id: string, newName: string): void {
    const template = this.templates.get(id)
    if (template) {
      template.name = newName
      this.saveToStorage()
      console.log('[TemplateManager] 重命名模板:', newName)
    }
  }

  /**
   * 更新模板信息
   */
  public updateTemplateInfo(
    id: string, 
    updates: { name?: string; description?: string; category?: string }
  ): void {
    const template = this.templates.get(id)
    if (template) {
      if (updates.name) template.name = updates.name
      if (updates.description !== undefined) template.description = updates.description
      if (updates.category) template.category = updates.category
      this.saveToStorage()
      console.log('[TemplateManager] 更新模板信息:', template.name)
    }
  }

  /**
   * 更新模板内容
   */
  public updateTemplate(id: string, schema: NodeSchema): void {
    const template = this.templates.get(id)
    if (template) {
      template.schema = JSON.parse(JSON.stringify(schema))
      this.saveToStorage()
      console.log('[TemplateManager] 更新模板:', template.name)
    }
  }

  /**
   * 保存到 IndexedDB
   */
  private async saveToStorage(): Promise<void> {
    try {
      const data = Array.from(this.templates.values())
      await indexedDBService.setItem(STORES.TEMPLATES, this.storageKey, data)
    } catch (error) {
      console.error('[TemplateManager] 保存失败:', error)
    }
  }

  /**
   * 从 IndexedDB 加载
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const saved = await indexedDBService.getItem<CustomTemplate[]>(STORES.TEMPLATES, this.storageKey)
      if (saved) {
        saved.forEach(template => {
          this.templates.set(template.id, template)
        })
        console.log('[TemplateManager] 加载模板:', saved.length, '个')
      }
    } catch (error) {
      console.error('[TemplateManager] 加载失败:', error)
    }
  }
}

export const templateManager = TemplateManager.getInstance()

