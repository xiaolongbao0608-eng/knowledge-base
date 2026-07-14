import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// 主内容目录（按 schema 顺序排列）
const contentDirs = [
  '00_导航与规则',
  '01_公司基础',
  '02_产品课程',
  '03_合作伙伴',
  '04_政府政策',
  '05_竞争市场',
  '06_招生营销',
  '07_运营财务',
  '08_高校对接',
  '09_提案生产',
  '10_产线工具',
]

// 递归扫描目录生成侧边栏
function scanDir(dirPath, baseRoute) {
  const items = []
  if (!fs.existsSync(dirPath)) return items

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.') && e.name !== 'node_modules')

  const files = entries
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  const dirs = entries
    .filter(e => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  for (const file of files) {
    const name = file.name.replace(/\.md$/, '')
    if (name === 'index') continue
    const link = `${baseRoute}/${file.name}`
    items.push({ text: name, link })
  }

  for (const subdir of dirs) {
    const subPath = path.join(dirPath, subdir.name)
    const subRoute = `${baseRoute}/${subdir.name}`
    const children = scanDir(subPath, subRoute)
    if (children.length > 0) {
      items.push({
        text: subdir.name,
        collapsed: true,
        collapsible: true,
        items: children,
      })
    }
  }

  return items
}

// 构建侧边栏
const wikiSidebar = scanDir(path.join(rootDir, 'wiki'), '/wiki')
const sidebar = [
  { text: '首页', link: '/' },
  ...contentDirs.map(dir => ({
    text: dir,
    collapsed: true,
    collapsible: true,
    items: scanDir(path.join(rootDir, dir), `/${dir}`),
  })),
  ...(wikiSidebar.length > 0
    ? [{ text: '维基层 (wiki)', collapsed: true, collapsible: true, items: wikiSidebar }]
    : []),
]

export default defineConfig({
  srcDir: rootDir,

  title: '衍谷知识库',
  description: '衍谷 OPC · AI 产教融合知识库',
  lang: 'zh-CN',

  srcExclude: [
    '_归档/**',
    'node_modules/**',
    'raw/**',
    '.obsidian/**',
    'kb-wiki/**',
    'aigc项目/**',
    '合同/**',
    '剧本/**',
    '项目/**',
    '小红包/**',
    '衍谷ob/**',
    'Obsidian/**',
    'strategy-five-dim-deductor/**',
    '.vitepress/**',
    '.git/**',
    // 第三方软件包/运行时 — 避免 Mustache/HTML 触发 Vue 模板解析错误
    '02_产品课程/**/ComfyUI/**',
    '02_产品课程/**/custom_nodes/**',
    '02_产品课程/**/python_embeded/**',
  ],

  ignoreDeadLinks: true,

  cleanUrls: true,

  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'SCHEMA', link: '/SCHEMA' },
      { text: '更新日志', link: '/log' },
    ],

    sidebar,

    socialLinks: [],

    outline: {
      level: [2, 4],
      label: '本页目录',
    },

    search: {
      provider: 'local',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdatedText: '最后更新',

    returnToTopLabel: '返回顶部',

    sidebarMenuLabel: '目录',

    darkModeSwitchLabel: '主题',

    lightModeSwitchTitle: '切换至浅色模式',

    darkModeSwitchTitle: '切换至深色模式',
  },
})

