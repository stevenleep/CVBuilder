# 物料系统

## 什么是物料

物料（Material）是 CVBuilder 的基本构建单元。每个物料都是一个可复用、可配置的 React 组件，用于构建简历的不同部分。

### 物料的特点

- ✅ **可复用** - 一次定义，多处使用
- ✅ **可配置** - 通过属性面板调整
- ✅ **可组合** - 物料可以嵌套组合
- ✅ **类型安全** - TypeScript 类型检查
- ✅ **主题适配** - 自动适应主题样式

## 物料分类

### 基础物料 (Base)

基础布局和通用组件。

#### Container（容器）

通用容器组件，用于包裹其他元素。

**使用场景**:
- 分组相关内容
- 添加背景色或边框
- 控制内边距和外边距

**常用属性**:
- `padding` - 内边距
- `margin` - 外边距
- `backgroundColor` - 背景颜色
- `border` - 边框样式

#### Row（行）

水平布局容器。

**使用场景**:
- 并排显示多个元素
- 创建多列布局
- 响应式排列

**常用属性**:
- `gap` - 子元素间距
- `justify` - 水平对齐方式
- `align` - 垂直对齐方式
- `wrap` - 是否换行

#### Grid（网格）

网格布局容器。

**使用场景**:
- 创建复杂的网格布局
- 响应式多列内容
- 对齐多个元素

**常用属性**:
- `columns` - 列数
- `gap` - 间距
- `autoFlow` - 自动填充方式

#### Heading（标题）

标题文本组件。

**使用场景**:
- 章节标题
- 分组标题
- 强调文本

**常用属性**:
- `level` - 标题级别 (h1-h6)
- `text` - 标题文本
- `align` - 对齐方式
- `color` - 文字颜色

#### Image（图片）

图片显示组件。

**使用场景**:
- 个人头像
- 证书图片
- 装饰图标

**常用属性**:
- `src` - 图片地址
- `alt` - 替代文本
- `width` - 宽度
- `height` - 高度
- `fit` - 填充方式

#### Spacer（间距）

添加空白间距。

**使用场景**:
- 控制元素间距
- 添加垂直或水平空白
- 精确调整布局

**常用属性**:
- `height` - 高度
- `width` - 宽度

### 简历物料 (Resume)

专门为简历设计的组件。

#### PersonalInfo（个人信息）

显示个人基本信息。

**包含字段**:
- 姓名、职位
- 联系方式（电话、邮箱）
- 地址信息
- 社交媒体链接
- 个人头像

**分组**:
- **核心信息**: 姓名、年龄、工作年限、学历、期望薪资
- **补充信息**: 性别、出生日期、婚姻状况、政治面貌
- **联系方式**: 电话、邮箱、微信、现居地
- **在线链接**: GitHub、LinkedIn、个人网站、博客
- **外观**: 显示头像、对齐方式

#### EducationItem（教育经历）

单条教育经历。

**包含字段**:
- 学校名称
- 专业
- 学历
- 起止时间
- GPA/成绩
- 奖学金/荣誉
- 主要课程

**分组**:
- **基本信息**: 学校、专业、学历、时间、地点
- **详细信息**: GPA、排名、奖学金、成就、课程
- **补充信息**: 专业类型、转学信息、论文

#### ExperienceItem（工作经历）

单条工作经历。

**包含字段**:
- 公司名称
- 职位
- 起止时间
- 工作描述
- 工作成就
- 技术栈

**分组**:
- **核心信息**: 公司、职位、时间、描述、成就
- **公司信息**: 行业、规模
- **职位信息**: 部门、级别、类型
- **时间地点**: 起止日期、工作地点
- **工作性质**: 雇佣类型、工作模式
- **技术信息**: 技术栈
- **团队信息**: 团队规模、汇报对象
- **薪资**: 起始薪资、结束薪资

#### ProjectItem（项目经历）

项目经历条目。

**包含字段**:
- 项目名称
- 项目角色
- 项目时间
- 项目描述
- 技术栈
- 项目链接

#### SkillList（技能列表）

技能标签列表。

**使用场景**:
- 编程语言
- 框架和工具
- 软技能

**样式**:
- 标签样式
- 网格布局
- 进度条样式

#### SkillRating（技能评级）

带评级的技能。

**使用场景**:
- 语言能力
- 工具熟练度
- 技能水平

**评级方式**:
- 星级评分
- 进度条
- 百分比

#### Section（章节）

章节容器，带标题。

**使用场景**:
- 教育背景章节
- 工作经历章节
- 项目经验章节

**包含**:
- 章节标题
- 章节图标
- 子内容

#### TextBlock（文本块）

富文本内容块。

**使用场景**:
- 自我评价
- 项目描述
- 其他文字内容

**支持格式**:
- 加粗、斜体
- 无序列表、有序列表
- 超链接

#### Divider（分割线）

分割线组件。

**使用场景**:
- 章节分隔
- 视觉分组

**样式**:
- 实线、虚线、点线
- 颜色、粗细

### 复合物料 (Composite)

预组合的高级组件。

#### EducationSection（教育背景章节）

包含多个教育经历的完整章节。

**包含**:
- Section 标题
- 多个 EducationItem

#### WorkExperienceSection（工作经历章节）

包含多个工作经历的完整章节。

**包含**:
- Section 标题
- 多个 ExperienceItem

#### SkillsSection（技能章节）

技能展示章节。

**包含**:
- Section 标题
- SkillList 或 SkillRating

## 使用物料

### 添加物料

#### 方法 1: 拖拽添加

1. 在左侧物料面板找到物料
2. 拖拽到画布目标位置
3. 松开鼠标完成添加

#### 方法 2: 双击添加

1. 双击物料面板中的物料
2. 物料自动添加到画布末尾

#### 方法 3: 快捷方式

1. 选中父节点
2. 右键 → 添加子节点
3. 选择物料类型

### 编辑物料

#### 属性面板编辑

1. **选中物料** - 单击画布中的物料
2. **查看属性** - 右侧显示属性面板
3. **编辑属性** - 修改各个属性值
4. **实时预览** - 画布立即更新

#### 双击快捷编辑

某些物料支持双击快速编辑主要内容：

- **TextBlock** - 双击编辑文本
- **Heading** - 双击编辑标题
- **PersonalInfo** - 双击编辑姓名

### 物料操作

#### 复制物料

```
方法1: Cmd/Ctrl + C → Cmd/Ctrl + V
方法2: Cmd/Ctrl + D (快速复制)
方法3: 右键 → 复制
```

#### 删除物料

```
方法1: Delete 键
方法2: 右键 → 删除
方法3: 属性面板 → 删除按钮
```

#### 移动物料

```
方法1: 在结构树中拖拽
方法2: 使用上移/下移按钮
方法3: 剪切粘贴
```

#### 保存为模板

1. 选中物料
2. 右键 → 保存为模板
3. 输入模板名称和描述
4. 模板出现在自定义模板中

## 物料属性

### 通用属性

所有物料都支持的属性：

#### 样式属性

- **margin** - 外边距
- **padding** - 内边距
- **backgroundColor** - 背景颜色
- **border** - 边框
- **borderRadius** - 圆角

#### 布局属性

- **width** - 宽度
- **height** - 高度
- **display** - 显示方式
- **position** - 定位方式

#### 文本属性

- **color** - 文字颜色
- **fontSize** - 字体大小
- **fontWeight** - 字体粗细
- **textAlign** - 文本对齐

### 属性类型

#### String（字符串）

单行文本输入。

```typescript
{
  name: 'title',
  type: 'string',
  defaultValue: '标题'
}
```

#### Textarea（多行文本）

多行文本输入。

```typescript
{
  name: 'description',
  type: 'textarea',
  defaultValue: ''
}
```

#### RichText（富文本）

支持格式化的文本。

```typescript
{
  name: 'content',
  type: 'richtext',
  defaultValue: ''
}
```

#### Number（数字）

数字输入。

```typescript
{
  name: 'age',
  type: 'number',
  defaultValue: 18
}
```

#### Boolean（布尔）

开关选项。

```typescript
{
  name: 'showAvatar',
  type: 'boolean',
  defaultValue: false
}
```

#### Select（选择）

下拉选择。

```typescript
{
  name: 'gender',
  type: 'select',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]
}
```

#### Color（颜色）

颜色选择器。

```typescript
{
  name: 'textColor',
  type: 'color',
  defaultValue: '#333333'
}
```

#### Date（日期）

日期选择器。

```typescript
{
  name: 'startDate',
  type: 'date',
  defaultValue: '2020-01'
}
```

### 属性分组

属性可以分组显示，便于管理：

```typescript
propsSchema: [
  {
    name: 'name',
    label: '姓名',
    type: 'string',
    group: '基本信息'
  },
  {
    name: 'phone',
    label: '电话',
    type: 'string',
    group: '联系方式'
  }
]
```

### 条件显示

某些属性只在特定条件下显示：

```typescript
{
  name: 'avatar',
  label: '头像URL',
  type: 'string',
  visibleWhen: props => props.showAvatar === true
}
```

## 物料主题

### 使用主题

物料会自动适应当前主题：

```typescript
import { useThemeConfig } from '@/core/context/ThemeContext'

const MyMaterial = () => {
  const theme = useThemeConfig()
  
  return (
    <div style={{
      color: theme.color.text.primary,
      fontSize: theme.font.bodySize.normal
    }}>
      内容
    </div>
  )
}
```

### 主题变量

可用的主题变量：

#### 颜色

```typescript
theme.color.text.primary    // 主要文字
theme.color.text.secondary  // 次要文字
theme.color.text.tertiary   // 辅助文字
theme.color.border.light    // 浅色边框
theme.color.border.dark     // 深色边框
```

#### 字体

```typescript
theme.font.bodySize.small   // 小号字体
theme.font.bodySize.normal  // 正常字体
theme.font.bodySize.large   // 大号字体
theme.font.titleSize.h1     // 一级标题
theme.font.titleSize.h2     // 二级标题
theme.font.weight.normal    // 正常粗细
theme.font.weight.bold      // 加粗
```

#### 间距

```typescript
theme.spacing.line          // 行间距
theme.spacing.paragraph     // 段落间距
theme.spacing.section       // 章节间距
theme.spacing.item          // 项目间距
```

## 最佳实践

### 1. 合理组织结构

```
Page
└── Container
    ├── PersonalInfo
    ├── Section (教育背景)
    │   ├── EducationItem
    │   └── EducationItem
    └── Section (工作经历)
        ├── ExperienceItem
        └── ExperienceItem
```

### 2. 使用语义化物料

- 用 `Section` 组织章节，不要只用 `Container`
- 用专门的物料如 `EducationItem`，不要都用 `TextBlock`

### 3. 合理使用间距

- 使用 `Spacer` 组件而不是空的 `Container`
- 利用物料自带的 `margin` 和 `padding`

### 4. 复用模板

- 经常使用的组合保存为模板
- 给模板起清晰的名称
- 添加描述说明用途

### 5. 保持简洁

- 不要过度嵌套
- 合理使用复合物料
- 删除不必要的容器

## 常见问题

### Q: 如何隐藏某个字段？

A: 在属性面板中将该字段设为空，或使用条件显示功能。

### Q: 可以自定义物料吗？

A: 可以！查看[物料开发指南](./material-development.md)。

### Q: 物料数据保存在哪里？

A: 保存在浏览器的 IndexedDB 中，不会上传到服务器。

### Q: 可以导出物料数据吗？

A: 可以导出整个简历为 JSON 文件。

### Q: 物料支持国际化吗？

A: 当前版本暂不支持，可以通过插件实现。

## 相关文档

- [基础使用](./basic-usage.md)
- [物料开发指南](./material-development.md)
- [物料 API](../api/material-api.md)
- [物料示例](../examples/material-examples.md)

