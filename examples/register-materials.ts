/**
 * 示例物料注册
 */

import { IMaterialRegistry } from '../src/core'
import { ChartMaterialDefinition } from './materials/ChartMaterial'
import { QRCodeMaterialDefinition } from './materials/QRCodeMaterial'
import { SkillRadarMaterialDefinition } from './materials/SkillRadarMaterial'

export interface IExampleMaterialsConfig {
  enableChart?: boolean
  enableQRCode?: boolean
  enableSkillRadar?: boolean
}

const defaultConfig: IExampleMaterialsConfig = {
  enableChart: true,
  enableQRCode: true,
  enableSkillRadar: true,
}

export function registerExampleMaterials(
  registry: IMaterialRegistry,
  config: IExampleMaterialsConfig = {}
) {
  const finalConfig = {
    ...defaultConfig,
    ...config,
  }

  console.group('[Example Materials] 开始注册示例物料')

  let registeredCount = 0

  try {
    if (finalConfig.enableChart) {
      registry.register(ChartMaterialDefinition)
      console.log('  ✓ 图表物料 (Chart) 已注册')
      registeredCount++
    }

    if (finalConfig.enableQRCode) {
      registry.register(QRCodeMaterialDefinition)
      console.log('  ✓ 二维码物料 (QRCode) 已注册')
      registeredCount++
    }

    if (finalConfig.enableSkillRadar) {
      registry.register(SkillRadarMaterialDefinition)
      console.log('  ✓ 技能雷达图物料 (SkillRadar) 已注册')
      registeredCount++
    }

    console.log(`✅ [Example Materials] 已成功注册 ${registeredCount} 个示例物料`)
    console.groupEnd()
  } catch (error) {
    console.error('❌ [Example Materials] 示例物料注册失败:', error)
    console.groupEnd()
    throw error
  }
}
