<div align="center">

# 🎯 Bilibili 广告跳过工具 后端实现

**适用于[切片广告之友](https://github.com/OtokoNoIzumi/adskip)扩展的后端实现**

[![GitHub stars](https://img.shields.io/github/stars/klxf/adskip-backend?colHub%20Stor=yellow&label=Gitars)](https://github.com/klxf/adskip-backend/stargazers)
[![GitHub license](https://img.shields.io/github/license/klxf/adskip-backend?color=blue)](https://github.com/klxf/adskip-backend/blob/main/LICENSE.md)
[![GitHub last commit](https://img.shields.io/github/last-commit/klxf/adskip-backend)](https://github.com/klxf/adskip-backend/commits)

</div>

## 📖 简介

Bilibili 广告跳过工具的私有部署后端实现，提供了精简的 API 接口，供扩展使用。

本项目使用 Google Gemini API 依赖于提示词工程进行广告识别，使用 TypeScript 编写，基于 Node.js 和 Express 框架。

本项目 API 仅支援扩展的核心功能，统计信息等功能不可用。

## 🚀 快速开始
### 1. 克隆仓库

```bash
git clone --depth=1 https://github.com/klxf/adskip-backend.git
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量
在项目根目录下创建 `.env` 文件，根据 `.env.example` 进行配置

```dotenv
# .env.example
# 定义 Gmini API Host
GEMINI_API_HOST=https://generativelanguage.googleapis.com
# Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
# 最大请求体大小
BODY_LIMIT=100kb
# 服务端口号
PORT=3000

# CORS 配置
CORS_ORIGINS=http://localhost:8080,https://www.bilibili.com,extension://dicbndgaokkkafcehlfmkllbipeekfhi

# Google Gemini 模型配置
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TEMPERATURE=0.25
GEMINI_TOP_P=1

# 自定义请求头（可选）
CUSTOM_HEADERS=
```

### 4. 编译并启动

```bash
npm run build
npm start
```

### 5. 配置扩展

在扩展的全局设置中，进入“数据管理”选项卡，在“服务器地址”输入框中输入 `http://localhost:3000` 或者你部署的服务器地址，开启“启用自定义服务器”即可。

## 📄 API 文档
### `/api/detect`
#### 请求

```http
POST /api/detect-ads
Content-Type: application/json
```

#### 请求体

*此处仅列出必要字段*

| 字段名称                                      | 类型     | 描述          |
|:------------------------------------------|:-------|:------------|
| `videoData`                               | Object | 视频的详细数据     |
| `videoData.bvid`                          | String | 视频 BVID     |
| `videoData.title`                         | String | 视频标题        |
| `videoData.subtitle_contents`             | Array  | 字幕内容数组      |
| `videoData.subtitle_contents[][]`         | Array  | 包含多个字幕片段的数组 |
| `videoData.subtitle_contents[][].from`    | Number | 字幕开始时间      |
| `videoData.subtitle_contents[][].content` | String | 字幕文本内容      |
| `user`                                    | Object | 用户信息        |
| `user.username`                           | String | 用户名         |
| `user.uid`                                | Number | UID         |
| `user.level`                              | Number | 用户等级        |

#### 响应

| 字段名称                                        | 类型      | 描述            |
|:--------------------------------------------|:--------|:--------------|
| `success`                                   | Boolean | 检测是否成功        |
| `videoId`                                   | String  | 视频 BVID       |
| `hasAds`                                    | Boolean | 视频中是否检测到广告    |
| `adTimestamps`                              | Array   | 广告时间戳信息的数组    |
| `adTimestamps[].adTimestamps`               | Array   | 嵌套的广告时间戳详情数组  |
| `adTimestamps[].adTimestamps[].start`       | Number  | 广告开始时间点，单位为秒。 |
| `adTimestamps[].adTimestamps[].end`         | Number  | 广告结束时间点，单位为秒。 |
| `adTimestamps[].adTimestamps[].description` | String  | 广告时间段的描述      |
| `adTimestamps[].adTimestamps[].confidence`  | Number  | 置信度           |
| `message`                                   | String  | 消息            |
| `confidence`                                | Number  | 整体置信度         |
| `fromCache`                                 | Boolean | 结果是否来自缓存      |
| `requestId`                                 | String  | 唯一标识符         |

### `/api/user/stats`
#### 请求

```http
POST /api/user/stats
Content-Type: application/json
```

#### 请求体

| 字段名称                 | 类型     | 描述            |
|:---------------------|:-------|:--------------|
| `username`           | String | 用户名           |
| `uid`                | Number | 用户 UID        |
| `level`              | Number | 用户等级          |
| `vipType`            | Number | VIP 类型        |
| `vipDueDate`         | Number | VIP 到期时间戳（毫秒） |
| `local_popup_opens`  | Number | 本地弹窗打开次数      |
| `local_share_clicks` | Number | 本地分享点击次数      |

#### 响应

| 字段名称                                     | 类型      | 描述                |
|:-----------------------------------------|:--------|:------------------|
| `uid`                                    | Number  | 用户 UID            |
| `bili_level`                             | Number  | 用户等级              |
| `account_type`                           | Number  | 账号类型              |
| `account_type_display`                   | String  | 账号类型显示文本          |
| `vip_type`                               | Number  | 大会员类型             |
| `vip_due_date`                           | String  | 大会员到期时间           |
| `is_vip_active`                          | Boolean | 大会员是否有效           |
| `is_in_trial_period`                     | Boolean | 是否在试用期            |
| `trial_end_date`                         | String  | 试用期结束日期           |
| `base_limit_from_level`                  | Number  | 基础请求限制            |
| `trial_bonus`                            | Number  | 试用期奖励次数           |
| `vip_bonus`                              | Number  | 大会员奖励次数           |
| `daily_gemini_requests_used`             | Number  | 今日已使用的 Gemini 请求数 |
| `daily_gemini_limit`                     | Number  | 今日 Gemini 请求限制    |
| `total_videos_processed`                 | Number  | 处理的视频总数           |
| `total_video_duration_processed_display` | String  | 处理的视频总时长          |
| `total_ads_duration_display`             | String  | 处理的广告总时长          |
| `total_videos_with_ads`                  | Number  | 包含广告的视频总数         |
| `local_popup_opens`                      | Number  | 本地弹窗打开次数          |
| `local_share_clicks`                     | Number  | 本地分享点击次数          |
| `message`                                | String  | 响应消息              |

### `/api/getSupportPicUrl`
#### 请求

```http
GET /api/getSupportPicUrl
```

#### 响应

| 字段名称            | 类型      | 描述        |
|:----------------|:--------|:----------|
| `supportPicUrl` | String  | 支持图片的 URL |
| `title`         | String  | 标题        |
| `description`   | String  | 图片描述      |
| `altText`       | String  | 图片替代文本    |
| `enabled`       | Boolean | 是否启用      |

## 📜 开源许可

本项目使用 [MIT License](https://choosealicense.com/licenses/mit/) 许可协议开源

本项目使用了 [:octocat: GitHub Copilot](https://github.com/copilot) 辅助开发
