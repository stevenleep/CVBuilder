/**
 * 简历模板管理器
 * 
 * 管理完整的简历模板
 */

import { PageSchema } from '@/types/material'
import { nanoid } from 'nanoid'

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
    this.loadFromStorage()
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
   * 保存到本地存储
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.templates.values())
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('[ResumeTemplateManager] 保存失败:', error)
    }
  }

  /**
   * 从本地存储加载
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        const data: ResumeTemplate[] = JSON.parse(saved)
        data.forEach(template => {
          this.templates.set(template.id, template)
        })
        console.log('[ResumeTemplateManager] 加载简历模板:', data.length, '个')
      }
    } catch (error) {
      console.error('[ResumeTemplateManager] 加载失败:', error)
    }
  }
}

export const resumeTemplateManager = ResumeTemplateManager.getInstance()

