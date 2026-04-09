你是一个资深 DevOps 架构师 + 全栈工程师，请为一个前端项目设计并实现一套“可直接运行”的企业级 CI/CD 自动化部署方案。

# 一、项目背景

- 前后端分离项目
- 前端：ai-frontend
- 后端：ai-backend
- 前后端通过 HTTP 协议通信
- 前端项目使用 React + TypeScript
- 后端项目使用 NestJS + TypeScript
- 前后端项目都使用 阿里云镜像服务
- 前后端项目都使用 GitHub 管理
- 部署环境：阿里云 ECS

# 二、核心目标（必须全部实现）

当代码 push 到 main 分支时，自动完成以下流程：

1. CI 阶段：

   - 安装依赖
   - 构建前端项目
   - 构建 Docker 镜像（必须使用多阶段构建优化体积）
   - 生成唯一版本号（禁止使用 latest）

2. 镜像处理：

   - 自动登录阿里云镜像仓库
   - 推送镜像（带版本 tag）

3. CD 部署阶段（通过 SSH 到服务器）：
   - 更新 docker-compose.yml 中的镜像版本号
   - 拉取最新镜像
   - 启动新版本服务
   - 完成蓝绿切换（不中断服务）

# 三、必须实现的工程能力（重点）

## 1. CI/CD

- 使用 GitHub Actions
- 构建失败必须终止部署
- workflow 结构清晰（build / deploy 分阶段）

## 2. 蓝绿部署（必须实现）

- 定义两个服务：
  - frontend_blue
  - frontend_green
- 使用 nginx 或 docker-compose 控制流量切换
- 发布时新版本先启动，再切换流量

## 3. 自动回滚机制（必须实现）

- 新版本启动后进行健康检查（HTTP 请求）
- 如果健康检查失败：
  - 自动切回旧版本
  - 保持服务可用
- 需要给出具体实现方式（脚本或命令）

## 4. 多环境支持

- 支持 dev / test / prod
- 使用 .env 文件隔离环境变量
- 根据分支自动选择环境：
  - main → prod
  - develop → dev

## 5. 健康检查

- Docker 容器必须配置 healthcheck
- 部署流程中必须检测服务状态（例如 curl /health）

## 6. 版本管理（必须规范）

- 使用 commit hash 或时间戳作为 tag
- 示例：
  ai-frontend:20260407-abc123
- 严禁使用 latest

## 7. Secrets 管理（必须规范）

- 所有敏感信息必须使用 GitHub Secrets：
  - 镜像仓库密码
  - SSH 私钥
- 不允许写死在代码中
- 给出需在 GitHub 中配置的 Secrets 列表

## 8. 日志与扩展能力（轻量实现）

- 容器日志必须可输出（stdout）
- 预留监控扩展能力（例如 prometheus 接入点说明）

# 四、资源信息（必须使用）

阿里云镜像仓库：

- registry: crpi-3iew34pvm0fklze5.cn-chengdu.personal.cr.aliyuncs.com
- namespace: jijiking1
- repository: ai-frontend、ai-backend
- username: JJKing11

# 七、约束（非常重要）

- 所有代码必须是“可运行”的真实配置，不要示例代码
- 不允许省略关键配置
- 不允许使用 latest 标签
- 必须考虑部署失败场景
- 所有变量必须可配置（不要写死）
- 输出要符合生产环境规范（不是 demo）
