# 主题定制

## 主题系统概述

CVBuilder 提供了灵活的主题系统，允许你自定义简历的外观和风格。

### 主题的作用

- 🎨 **统一风格** - 保持整体视觉一致性
- 🔄 **快速切换** - 一键更换简历风格
- 📱 **响应式** - 自动适配不同场景
- 💾 **可保存** - 保存和复用主题配置

## 使用预设主题

### 查看主题

点击右侧工具栏的主题按钮，查看可用主题：

- **现代简约** - 清爽现代的风格
- **商务专业** - 稳重的商务风格
- **创意活泼** - 富有创意的风格
- **学术经典** - 学术风格的布局

### 切换主题

1. 打开主题面板
2. 点击预览缩略图
3. 实时查看效果
4. 确认应用

## 自定义主题

### 颜色配置

#### 文字颜色

```typescript
{
  text: {
    primary: '#1a1a1a',    // 主要文字 - 标题、姓名
    secondary: '#4a4a4a',  // 次要文字 - 正文内容
    tertiary: '#7a7a7a',   // 辅助文字 - 说明信息
    link: '#0066cc',       // 链接颜色
    highlight: '#2c5282',  // 高亮文字
  }
}
```

**使用场景**:
- `primary` - 姓名、章节标题
- `secondary` - 工作描述、教育信息
- `tertiary` - 联系方式、时间日期
- `link` - 网站链接、邮箱
- `highlight` - 重点信息、成就

#### 边框颜色

```typescript
{
  border: {
    light: '#e0e0e0',  // 浅色边框
    dark: '#333333',   // 深色边框
  }
}
```

**使用场景**:
- `light` - 分割线、卡片边框
- `dark` - 强调边框、重要区域

#### 背景颜色

```typescript
{
  background: {
    primary: '#ffffff',    // 主背景色
    secondary: '#f5f5f5',  // 次背景色
    accent: '#e3f2fd',     // 强调背景
  }
}
```

**使用场景**:
- `primary` - 页面主背景
- `secondary` - 卡片背景、区域背景
- `accent` - 高亮区域、特殊卡片

### 字体配置

#### 字体大小

```typescript
{
  bodySize: {
    small: 10,     // 小字 - 说明文字
    normal: 12,    // 正文 - 主要内容
    large: 14,     // 大字 - 强调内容
  },
  titleSize: {
    h1: 24,        // 一级标题 - 姓名
    h2: 18,        // 二级标题 - 章节
    h3: 16,        // 三级标题 - 子章节
    h4: 14,        // 四级标题
  }
}
```

#### 字体粗细

```typescript
{
  weight: {
    light: 300,    // 细体
    normal: 400,   // 正常
    medium: 500,   // 中等
    bold: 700,     // 加粗
  }
}
```

#### 字体家族

```typescript
{
  family: {
    primary: 'system-ui, sans-serif',      // 主要字体
    heading: 'Georgia, serif',             // 标题字体
    monospace: 'Monaco, monospace',        // 等宽字体
  }
}
```

**推荐字体**:

中文:
- `'PingFang SC', 'Microsoft YaHei'` - 黑体
- `'SimSun', 'Song'` - 宋体
- `'STKaiti', 'KaiTi'` - 楷体

英文:
- `'Arial', 'Helvetica'` - 无衬线
- `'Georgia', 'Times New Roman'` - 衬线
- `'Courier New', 'Monaco'` - 等宽

### 间距配置

```typescript
{
  spacing: {
    line: 6,         // 行间距 - 文字行之间
    paragraph: 12,   // 段落间距 - 段落之间
    section: 20,     // 章节间距 - 章节之间
    item: 16,        // 项目间距 - 列表项之间
  }
}
```

**调整建议**:
- **紧凑型简历**: 减小所有间距 (line: 4, paragraph: 8)
- **标准简历**: 使用默认值
- **宽松简历**: 增加间距 (line: 8, paragraph: 16)

### 布局配置

```typescript
{
  layout: {
    pageWidth: '210mm',      // A4 宽度
    pageHeight: '297mm',     // A4 高度
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm',
    },
    lineHeight: 1.6,         // 行高倍数
    columnGap: '20px',       // 列间距
  }
}
```

**页面尺寸**:
- A4: 210mm × 297mm
- Letter: 8.5in × 11in
- Custom: 自定义尺寸

## 创建自定义主题

### 步骤 1: 打开主题编辑器

1. 点击主题面板
2. 选择"自定义主题"
3. 开始编辑

### 步骤 2: 调整颜色

```typescript
// 示例: 创建"深色商务"主题
const darkBusinessTheme = {
  name: '深色商务',
  color: {
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
      tertiary: '#7f8c8d',
    },
    border: {
      light: '#bdc3c7',
      dark: '#2c3e50',
    },
  },
  // ... 其他配置
}
```

### 步骤 3: 调整字体

```typescript
font: {
  bodySize: {
    small: 10,
    normal: 11,
    large: 13,
  },
  titleSize: {
    h1: 26,
    h2: 18,
    h3: 15,
    h4: 13,
  },
  weight: {
    normal: 400,
    bold: 600,
  },
  family: {
    primary: '"Times New Roman", serif',
    heading: 'Georgia, serif',
  }
}
```

### 步骤 4: 调整间距

```typescript
spacing: {
  line: 5,
  paragraph: 10,
  section: 18,
  item: 14,
}
```

### 步骤 5: 保存主题

1. 点击"保存主题"
2. 输入主题名称
3. 添加描述（可选）
4. 确认保存

## 主题预设示例

### 现代简约

```typescript
export const modernTheme: ITheme = {
  name: '现代简约',
  color: {
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      tertiary: '#718096',
      link: '#3182ce',
      highlight: '#2b6cb0',
    },
    border: {
      light: '#e2e8f0',
      dark: '#4a5568',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f7fafc',
      accent: '#ebf8ff',
    },
  },
  font: {
    bodySize: { small: 10, normal: 12, large: 14 },
    titleSize: { h1: 24, h2: 18, h3: 16, h4: 14 },
    weight: { light: 300, normal: 400, medium: 500, bold: 700 },
    family: {
      primary: 'system-ui, -apple-system, sans-serif',
      heading: 'inherit',
      monospace: 'Monaco, monospace',
    },
  },
  spacing: {
    line: 6,
    paragraph: 12,
    section: 20,
    item: 16,
  },
  layout: {
    pageWidth: '210mm',
    pageHeight: '297mm',
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    lineHeight: 1.6,
    columnGap: '20px',
  },
}
```

### 商务专业

```typescript
export const businessTheme: ITheme = {
  name: '商务专业',
  color: {
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
      tertiary: '#7f8c8d',
      link: '#2980b9',
      highlight: '#16a085',
    },
    border: {
      light: '#bdc3c7',
      dark: '#2c3e50',
    },
    background: {
      primary: '#ffffff',
      secondary: '#ecf0f1',
      accent: '#d5f4e6',
    },
  },
  font: {
    bodySize: { small: 9, normal: 11, large: 13 },
    titleSize: { h1: 22, h2: 17, h3: 15, h4: 13 },
    weight: { light: 300, normal: 400, medium: 500, bold: 600 },
    family: {
      primary: 'Georgia, "Times New Roman", serif',
      heading: 'inherit',
      monospace: 'Consolas, monospace',
    },
  },
  spacing: {
    line: 5,
    paragraph: 10,
    section: 18,
    item: 14,
  },
  layout: {
    pageWidth: '210mm',
    pageHeight: '297mm',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    lineHeight: 1.5,
    columnGap: '15px',
  },
}
```

### 创意活泼

```typescript
export const creativeTheme: ITheme = {
  name: '创意活泼',
  color: {
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
      tertiary: '#a0aec0',
      link: '#9f7aea',
      highlight: '#ed8936',
    },
    border: {
      light: '#e2e8f0',
      dark: '#805ad5',
    },
    background: {
      primary: '#ffffff',
      secondary: '#faf5ff',
      accent: '#fef5e7',
    },
  },
  font: {
    bodySize: { small: 10, normal: 12, large: 15 },
    titleSize: { h1: 28, h2: 20, h3: 17, h4: 15 },
    weight: { light: 300, normal: 400, medium: 600, bold: 800 },
    family: {
      primary: '"SF Pro Display", "Helvetica Neue", sans-serif',
      heading: '"Montserrat", sans-serif',
      monospace: '"Fira Code", monospace',
    },
  },
  spacing: {
    line: 7,
    paragraph: 14,
    section: 24,
    item: 18,
  },
  layout: {
    pageWidth: '210mm',
    pageHeight: '297mm',
    margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    lineHeight: 1.7,
    columnGap: '25px',
  },
}
```

## 主题最佳实践

### 1. 颜色对比度

确保文字和背景有足够的对比度：

```typescript
// ✅ 好 - 高对比度
text.primary: '#1a1a1a'
background: '#ffffff'

// ❌ 不好 - 低对比度
text.primary: '#cccccc'
background: '#ffffff'
```

### 2. 字体大小

保持可读性：

```typescript
// ✅ 好 - 合适的字体大小
bodySize.normal: 11-12px

// ❌ 太小
bodySize.normal: 8px

// ❌ 太大
bodySize.normal: 16px
```

### 3. 间距一致

使用统一的间距体系：

```typescript
// ✅ 好 - 有规律的间距
spacing: {
  line: 6,         // 1x
  paragraph: 12,   // 2x
  section: 24,     // 4x
  item: 18,        // 3x
}

// ❌ 不好 - 无规律
spacing: {
  line: 7,
  paragraph: 11,
  section: 23,
  item: 15,
}
```

### 4. 打印适配

测试打印效果：

1. 切换到预览模式
2. 使用浏览器打印预览 (Cmd/Ctrl + P)
3. 检查边距、字体大小
4. 确保没有内容被裁剪

### 5. 主题命名

使用清晰的命名：

```typescript
// ✅ 好
name: '现代简约'
name: '商务专业 - 深色'

// ❌ 不好
name: 'theme1'
name: '我的主题'
```

## 导出和分享主题

### 导出主题

```typescript
// 导出主题配置
const exportTheme = (theme: ITheme) => {
  const json = JSON.stringify(theme, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${theme.name}.json`
  link.click()
  URL.revokeObjectURL(url)
}
```

### 导入主题

```typescript
// 导入主题配置
const importTheme = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const theme = JSON.parse(e.target.result as string)
    // 应用主题
    applyTheme(theme)
  }
  reader.readAsText(file)
}
```

## 常见问题

### Q: 主题会影响已有内容吗？

A: 不会。主题只影响外观，不会修改内容数据。

### Q: 可以为不同章节使用不同主题吗？

A: 当前版本不支持，整个简历使用统一主题。

### Q: 主题保存在哪里？

A: 保存在浏览器 IndexedDB 中，不会丢失。

### Q: 如何恢复默认主题？

A: 在主题面板选择预设主题即可。

### Q: 主题支持深色模式吗？

A: 可以创建深色主题，但不会自动切换。

## 相关文档

- [基础使用](./basic-usage.md)
- [物料系统](./materials.md)
- [主题开发](./theme-development.md)
- [架构概览](./architecture.md)

