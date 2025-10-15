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

  if (finalConfig.enableChart) {
    registry.register(ChartMaterialDefinition)
  }

  if (finalConfig.enableQRCode) {
    registry.register(QRCodeMaterialDefinition)
  }

  if (finalConfig.enableSkillRadar) {
    registry.register(SkillRadarMaterialDefinition)
  }
}
