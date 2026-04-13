import type { ToolkitCategory, ToolkitTool } from './types';

/**
 * 分类列表
 * 将来接入示例：
 * const res = await request.get<{ data: ToolkitCategory[] }>('/api/toolkit/categories');
 */
export function getToolkitCategoriesMock(): ToolkitCategory[] {
  return [
    { id: 'all', label: '全部' },
    { id: 'dev', label: '开发' },
    { id: 'design', label: '设计' },
    { id: 'media', label: '媒体' },
    { id: 'lab', label: '实验' }
  ];
}

/**
 * 工具列表
 * 将来接入示例：
 * const res = await request.get<{ data: ToolkitTool[] }>('/api/toolkit/tools');
 */
export function getToolkitToolsMock(): ToolkitTool[] {
  return [
    {
      id: 't-editor',
      name: 'AI 视频分镜',
      description: '时间轴预览与分镜重排，适合快速验证剪辑结构。',
      categoryId: 'lab',
      href: '/editor',
      tags: ['视频', '时间轴', 'AI']
    },
    {
      id: 't-chat',
      name: 'Chat API 演示',
      description: '消息流与接口联调的轻量试验台。',
      categoryId: 'dev',
      href: '/chat-api',
      tags: ['API', '对话', '调试']
    },
    {
      id: 't-figma',
      name: 'Figma',
      description: '界面与组件协作，链接占位可换真实地址。',
      categoryId: 'design',
      href: 'https://www.figma.com',
      tags: ['UI', '协作', '原型']
    },
    {
      id: 't-vscode',
      name: 'VS Code',
      description: '本地开发与调试的主力编辑器。',
      categoryId: 'dev',
      href: 'https://code.visualstudio.com',
      tags: ['编辑器', '扩展', '调试']
    },
    {
      id: 't-notion',
      name: 'Notion',
      description: '文档与知识库，适合长文与清单。',
      categoryId: 'design',
      href: 'https://www.notion.so',
      tags: ['文档', '笔记', '协作']
    },
    {
      id: 't-obs',
      name: 'OBS Studio',
      description: '录屏与推流，适合做演示与直播。',
      categoryId: 'media',
      href: 'https://obsproject.com',
      tags: ['录屏', '直播', '推流']
    },
    {
      id: 't-ffmpeg',
      name: 'FFmpeg',
      description: '命令行音视频处理，批处理与脚本友好。',
      categoryId: 'media',
      href: 'https://ffmpeg.org',
      tags: ['CLI', '转码', '音视频']
    },
    {
      id: 't-raycast',
      name: 'Raycast',
      description: '启动器与快捷脚本，减少上下文切换。',
      categoryId: 'dev',
      href: 'https://www.raycast.com',
      tags: ['效率', '启动器', '脚本']
    },
    {
      id: 't-excalidraw',
      name: 'Excalidraw',
      description: '手绘风白板，适合架构草图与讨论。',
      categoryId: 'design',
      href: 'https://excalidraw.com',
      tags: ['白板', '草图', '协作']
    },
    {
      id: 't-docker',
      name: 'Docker',
      description: '容器化运行环境，统一开发与部署。',
      categoryId: 'dev',
      href: 'https://www.docker.com',
      tags: ['容器', '部署', '环境']
    },
    {
      id: 't-audacity',
      name: 'Audacity',
      description: '开源音频编辑，剪辑与降噪。',
      categoryId: 'media',
      href: 'https://www.audacityteam.org',
      tags: ['音频', '剪辑', '开源']
    },
    {
      id: 't-placeholder',
      name: '更多工具',
      description: '占位入口，接入后端后可替换为动态配置。',
      categoryId: 'lab',
      href: '#',
      tags: ['占位', 'Soon']
    }
  ];
}
