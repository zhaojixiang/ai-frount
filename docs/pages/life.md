# 生活记录（Life）

## 路由

- `/life`

## 业务梳理

生活记录独立页：**按年月归档**（侧栏或移动端横向月份入口）+ **时间轴** + **图文卡片**（图 + 标题 + 摘要 + 日期）。

数据按月份分组展示；同月内建议按 **日期倒序**。锚点 id 形式：`life-YYYY-MM`（与前端 `LifeArchive` / `LifeTimeline` 一致）。

当前数据来自 `src/pages/Life/mockData.ts`；前端也可在拿到 **扁平列表** 后自行分组，或由后端直接返回分组结构。

## 接口名称建议

### 方案 A：扁平列表 + 前端分组

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/life/records` | 获取全部或分页的生活记录 |

**查询参数（可选）**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `page` | number | 分页页码 |
| `pageSize` | number | 每页条数 |
| `year` | number | 仅某年 |
| `month` | number | 配合 `year` 过滤某月 |

### 方案 B：后端直接返回分组（减少前端计算）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/life/timeline` | 返回按月份分组后的树结构 |

---

## 数据格式定义

### 单条记录 `LifeRecord`

```json
{
  "id": "string",
  "date": "string",
  "title": "string",
  "excerpt": "string",
  "imageUrl": "string | null"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 主键 |
| `date` | string | 是 | 建议 `YYYY-MM-DD` |
| `title` | string | 是 | 标题 |
| `excerpt` | string | 是 | 摘要/正文节选 |
| `imageUrl` | string \| null | 否 | 配图 URL；无图前端展示占位 |

### 按月分组 `LifeMonthGroup`（方案 B 或前端计算）

```json
{
  "key": "2026-04",
  "year": 2026,
  "month": 4,
  "label": "2026年4月",
  "items": [ "LifeRecord" ]
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | string | `YYYY-MM`，用于锚点 `life-{key}` |
| `year` / `month` | number | 年、月 |
| `label` | string | 展示用中文月份标题 |
| `items` | array | 该月记录列表 |

### 归档树 `LifeYearArchive`（侧栏）

```json
{
  "year": 2026,
  "label": "2026年",
  "months": [
    {
      "key": "2026-04",
      "month": 4,
      "label": "4月",
      "count": 2
    }
  ]
}
```

**方案 B 响应示例**

```json
{
  "code": 200,
  "data": {
    "groups": [ "LifeMonthGroup" ],
    "archives": [ "LifeYearArchive" ]
  }
}
```

也可只返回 `groups`，由后端或前端从 `groups` 推导 `archives`。

---

## 数据库设计提示（可选）

- 表 `life_records`：`id`, `record_date`, `title`, `excerpt`, `image_url`, `created_at` 等。
- 按月归档：对 `record_date` 建索引，查询 `GROUP BY` 年、月或按范围拉取。
