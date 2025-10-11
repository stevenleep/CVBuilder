/**
 * 物料导出入口
 *
 * 统一注册所有物料（使用新的协议）
 */

import { IMaterialRegistry } from '@/core'

// 系统物料（不在面板显示）
import { PageMaterial } from './base/Page'

// 基础物料
import { ContainerMaterial } from './base/Container'
import { RowMaterial } from './base/Row'
import { GridMaterial } from './base/Grid'
import { TwoColumnLayoutMaterial } from './resume/TwoColumnLayout'
import { DividerMaterial } from './resume/Divider'
import { SpacerMaterial } from './base/Spacer'
import { HeadingMaterial } from './base/Heading'
import { ImageMaterial } from './base/Image'
import { LinkMaterial } from './base/Link'
import { BadgeMaterial } from './base/Badge'

// 复合物料 - 章节容器
import { WorkExperienceSectionMaterial } from './composite/WorkExperienceSection'
import { EducationSectionMaterial } from './composite/EducationSection'
import { SkillsSectionMaterial } from './composite/SkillsSection'
import { ProjectSectionMaterial } from './composite/ProjectSection'
import { CertificationSectionMaterial } from './composite/CertificationSection'
import { AwardSectionMaterial } from './composite/AwardSection'
import { LanguageSectionMaterial } from './composite/LanguageSection'
import { InterestsSectionMaterial } from './composite/InterestsSection'
import { SelfEvaluationSectionMaterial } from './composite/SelfEvaluationSection'
import { ExpectedPositionSectionMaterial } from './composite/ExpectedPositionSection'
import { SummarySectionMaterial } from './composite/SummarySection'

// 简历物料
import { PersonalInfoMaterial } from './resume/PersonalInfo'
import { SectionMaterial } from './resume/Section'
import { ExperienceItemMaterial } from './resume/ExperienceItem'
import { EducationItemMaterial } from './resume/EducationItem'
import { ProjectItemMaterial } from './resume/ProjectItem'
import { SkillListMaterial } from './resume/SkillList'
import { TextBlockMaterial } from './resume/TextBlock'
import { RichTextBlockMaterial } from './resume/RichTextBlock'
import { SummaryBlockMaterial } from './resume/SummaryBlock'
import { BulletListMaterial } from './resume/BulletList'
import { HighlightBoxMaterial } from './resume/HighlightBox'
import { MetricsCardMaterial } from './resume/MetricsCard'
import { CertificationItemMaterial } from './resume/CertificationItem'
import { LanguageSkillsMaterial } from './resume/LanguageSkills'
import { AwardItemMaterial } from './resume/AwardItem'
import { SkillRatingMaterial } from './resume/SkillRating'
import { InterestsHobbiesMaterial } from './resume/InterestsHobbies'
import { SelfEvaluationMaterial } from './resume/SelfEvaluation'
import { ExpectedPositionMaterial } from './resume/ExpectedPosition'

/**
 * 注册所有物料
 */
export function registerAllMaterials(registry: IMaterialRegistry) {
  // 系统物料（必需，但不在面板显示）
  registry.register(PageMaterial)

  // 基础物料
  registry.register(ContainerMaterial)
  registry.register(RowMaterial)
  registry.register(GridMaterial)
  registry.register(TwoColumnLayoutMaterial)
  registry.register(DividerMaterial)
  registry.register(SpacerMaterial)
  registry.register(HeadingMaterial)
  registry.register(ImageMaterial)
  registry.register(LinkMaterial)
  registry.register(BadgeMaterial)

  // 复合物料 - 章节容器
  registry.register(WorkExperienceSectionMaterial)
  registry.register(EducationSectionMaterial)
  registry.register(SkillsSectionMaterial)
  registry.register(ProjectSectionMaterial)
  registry.register(CertificationSectionMaterial)
  registry.register(AwardSectionMaterial)
  registry.register(LanguageSectionMaterial)
  registry.register(InterestsSectionMaterial)
  registry.register(SelfEvaluationSectionMaterial)
  registry.register(ExpectedPositionSectionMaterial)
  registry.register(SummarySectionMaterial)

  // 简历物料
  registry.register(PersonalInfoMaterial)
  registry.register(SectionMaterial)
  registry.register(ExperienceItemMaterial)
  registry.register(EducationItemMaterial)
  registry.register(ProjectItemMaterial)
  registry.register(SkillListMaterial)
  registry.register(BulletListMaterial)
  registry.register(TextBlockMaterial)
  registry.register(RichTextBlockMaterial)
  registry.register(SummaryBlockMaterial)
  registry.register(HighlightBoxMaterial)
  registry.register(MetricsCardMaterial)
  registry.register(CertificationItemMaterial)
  registry.register(LanguageSkillsMaterial)
  registry.register(AwardItemMaterial)
  registry.register(SkillRatingMaterial)
  registry.register(InterestsHobbiesMaterial)
  registry.register(SelfEvaluationMaterial)
  registry.register(ExpectedPositionMaterial)
}

// 导出所有物料定义
export {
  PageMaterial,
  ContainerMaterial,
  PersonalInfoMaterial,
  SectionMaterial,
  ExperienceItemMaterial,
  SkillListMaterial,
  TextBlockMaterial,
}
