/**
 * 简历模板管理器
 * 
 * 管理完整的简历模板
 */

import { PageSchema } from '@/types/material'
import { nanoid } from 'nanoid'
import { indexedDBService, STORES } from '@/utils/indexedDB'

export interface ResumeTemplate {
  id: string
  name: string
  description?: string
  thumbnail?: string
  schema: PageSchema
  createTime: string
  updateTime: string
}

class ResumeTemplateManager {
  private static instance: ResumeTemplateManager
  private templates: Map<string, ResumeTemplate> = new Map()
  private storageKey = 'resume-builder-resume-templates'

  private constructor() {
    this.loadFromStorage().catch(err => {
      console.error('[ResumeTemplateManager] 初始化加载失败:', err)
    })
  }

  public static getInstance(): ResumeTemplateManager {
    if (!ResumeTemplateManager.instance) {
      ResumeTemplateManager.instance = new ResumeTemplateManager()
    }
    return ResumeTemplateManager.instance
  }

  /**
   * 保存当前简历为模板
   */
  public saveAsTemplate(
    schema: PageSchema,
    name: string,
    description?: string
  ): ResumeTemplate {
    const template: ResumeTemplate = {
      id: nanoid(),
      name,
      description,
      schema: JSON.parse(JSON.stringify(schema)), // 深拷贝
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    }

    this.templates.set(template.id, template)
    this.saveToStorage()

    console.log('[ResumeTemplateManager] 保存简历模板:', template.name)
    return template
  }

  /**
   * 获取所有模板
   */
  public getAllTemplates(): ResumeTemplate[] {
    return Array.from(this.templates.values())
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  }

  /**
   * 获取模板
   */
  public getTemplate(id: string): ResumeTemplate | undefined {
    return this.templates.get(id)
  }

  /**
   * 删除模板
   */
  public deleteTemplate(id: string): void {
    this.templates.delete(id)
    this.saveToStorage()
    console.log('[ResumeTemplateManager] 删除模板:', id)
  }

  /**
   * 更新模板
   */
  public updateTemplate(id: string, updates: Partial<ResumeTemplate>): void {
    const template = this.templates.get(id)
    if (template) {
      Object.assign(template, updates, { updateTime: new Date().toISOString() })
      this.saveToStorage()
      console.log('[ResumeTemplateManager] 更新模板:', template.name)
    }
  }

  /**
   * 更新模板Schema
   */
  public updateTemplateSchema(id: string, schema: PageSchema): void {
    const template = this.templates.get(id)
    if (template) {
      template.schema = JSON.parse(JSON.stringify(schema))
      template.updateTime = new Date().toISOString()
      this.saveToStorage()
      console.log('[ResumeTemplateManager] 更新模板内容:', template.name)
    }
  }

  /**
   * 保存到 IndexedDB
   */
  private async saveToStorage(): Promise<void> {
    try {
      const data = Array.from(this.templates.values())
      await indexedDBService.setItem(STORES.RESUME_TEMPLATES, this.storageKey, data)
    } catch (error) {
      console.error('[ResumeTemplateManager] 保存失败:', error)
    }
  }

  /**
   * 从 IndexedDB 加载
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const saved = await indexedDBService.getItem<ResumeTemplate[]>(STORES.RESUME_TEMPLATES, this.storageKey)
      if (saved) {
        saved.forEach(template => {
          this.templates.set(template.id, template)
        })
        console.log('[ResumeTemplateManager] 加载简历模板:', saved.length, '个')
      }
    } catch (error) {
      console.error('[ResumeTemplateManager] 加载失败:', error)
    }
  }
}

export const resumeTemplateManager = ResumeTemplateManager.getInstance()

