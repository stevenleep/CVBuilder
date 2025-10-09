# 简历构建器 (Resume Builder)

一个专业的低代码简历构建器，采用**Notion风格**的拖拽编辑体验，基于React + TypeScript开发。

## ✨ 核心特性

- 🎨 **拖拽编辑**: 自由拖拽组件，即时排序
- 🖱️ **浮动工具栏**: 鼠标悬停显示快捷操作
- 📦 **丰富物料**: 13个专业简历组件
- 🎯 **双击编辑**: 快速编辑文本内容
- 🔌 **插件化**: 高度可扩展架构
- 💾 **自动保存**: 本地存储持久化
- ↩️ **撤销重做**: 完整历史记录
- 📱 **A4标准**: 标准简历尺寸

## 🏗️ 架构设计

### 核心理念

1. **协议驱动** - 所有能力通过接口定义
2. **依赖注入** - DI容器管理服务
3. **事件驱动** - 发布订阅解耦
4. **插件化** - 可扩展能力

### 技术栈

- React 18 + TypeScript 5
- Zustand + Immer (状态管理)
- react-dnd (拖拽系统)
- Vite (构建工具)
- Lucide React (图标)

## 📦 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🎯 使用指南

### 基本操作

1. **添加组件**
   - 点击左侧组件库中的组件
   - 或拖拽组件到画布

2. **编辑组件**
   - 单击选中组件
   - 在右侧属性面板编辑
   - 或双击组件快速编辑

3. **移动组件**
   - 拖拽组件到目标位置
   - 或使用浮动工具栏的上移/下移按钮

4. **删除/复制**
   - 鼠标悬停显示工具栏
   - 点击复制或删除按钮

### 物料库

#### 基础组件 (4个)
- **A4页面** - 标准页面容器
- **布局容器** - 自由布局
- **两栏布局** - 左右分栏
- **分隔线** - 视觉分隔

#### 简历组件 (9个)
- **个人信息** - 姓名、职位、联系方式
- **章节容器** - 内容区块
- **工作经历** - 公司、职位、描述
- **教育经历** - 学校、专业、学位
- **项目经历** - 项目详情
- **技能列表** - 技能标签
- **列表** - 项目符号列表
- **文本块** - 自由文本
- **个人总结** - 自我评价

## 🎨 设计特点

### 极简扁平
- 纯色设计，无渐变
- 极简阴影和边框
- 统一的视觉语言

### 交互流畅
- Notion风格浮动工具栏
- 丝滑的拖拽体验
- 即时视觉反馈

### 专业品质
- A4标准尺寸
- 精致的排版
- 企业级视觉

## 🔧 开发指南

### 添加新物料

```typescript
export const MyMaterial: IMaterialDefinition = {
  meta: {
    type: 'MyMaterial',
    title: '我的物料',
    description: '描述',
    category: 'resume',
  },
  component: MyComponent,
  propsSchema: [...],
  defaultProps: {...},
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
  },
  // 双击行为
  onDoubleClick: (context) => {
    // 快速编辑逻辑
  },
  // 自定义Actions
  actions: [
    {
      id: 'my-action',
      label: '我的操作',
      execute: (context) => {
        // 执行逻辑
      },
    },
  ],
}
```

### 快捷键

- `⌘Z` / `Ctrl+Z` - 撤销
- `⌘⇧Z` / `Ctrl+Shift+Z` - 重做
- `⌘S` / `Ctrl+S` - 保存
- `Delete` / `Backspace` - 删除选中
- `⌘D` / `Ctrl+D` - 复制选中

## 📖 文档

- [架构设计](./ARCHITECTURE.md) - 详细架构说明
- [修改日志](./log.md) - 开发记录

## 🎯 Roadmap

- [x] 拖拽编辑
- [x] 浮动工具栏
- [x] 双击编辑
- [ ] 右键菜单
- [ ] 键盘快捷键
- [ ] PDF导出
- [ ] 模板系统
- [ ] 协作编辑

## 📄 License

MIT License

---

**Built with ❤️ using React + TypeScript**
