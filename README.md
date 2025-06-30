<div align="center">

# 🎯 Bilibili 广告跳过工具 后端实现

**适用于[切片广告之友](https://github.com/OtokoNoIzumi/adskip)扩展的后端实现**

[![GitHub stars](https://img.shields.io/github/stars/klxf/adskip-backend?colHub%20Stor=yellow&label=Gitars)](https://github.com/klxf/adskip-backend/stargazers)
[![GitHub license](https://img.shields.io/github/license/klxf/adskip-backend?color=blue)](https://github.com/klxf/adskip-backend/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/klxf/adskip-backend)](https://github.com/klxf/adskip-backend/commits)

</div>

## 📖 简介
Bilibili 广告跳过工具的后端实现，提供了一个简单的 API 接口，供扩展使用。

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
GEMINI_API_HOST=https://generativelanguage.googleapis.com
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3000
CORS_ORIGINS=http://localhost:8080,https://www.bilibili.com

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

## 📄 API 文档
### `/api/detect-ads`
#### 请求

```http
POST /api/detect-ads
Content-Type: application/json
```

#### 请求体

| 字段名称                                      | 类型      | 描述              |
|:------------------------------------------|:--------|:----------------|
| `videoId`                                 | String  | 视频 BVID         |
| `title`                                   | String  | 视频标题            |
| `uploader`                                | String  | UP 主名称          |
| `mid`                                     | Number  | UP 主 UID        |
| `duration`                                | Number  | 视频总时长，单位秒       |
| `autoDetect`                              | Boolean | 是否自动检测          |
| `clientVersion`                           | String  | 客户端版本号          |
| `videoData`                               | Object  | 【必须】视频的详细数据     |
| `videoData.bvid`                          | String  | 【必须】视频 BVID     |
| `videoData.title`                         | String  | 【必须】视频标题        |
| `videoData.owner`                         | Object  | UP 主信息          |
| `videoData.owner.mid`                     | Number  | UP 主 UID        |
| `videoData.owner.name`                    | String  | UP 主名称          |
| `videoData.owner.face`                    | String  | UP 主头像 URL      |
| `videoData.mid`                           | Number  | UP 主 UID        |
| `videoData.desc`                          | String  | 视频的描述           |
| `videoData.dynamic`                       | String  | 视频动态信息          |
| `videoData.duration`                      | Number  | 视频总时长           |
| `videoData.pages`                         | Array   | 视频的分 P 信息数组     |
| `videoData.pubdate`                       | Number  | 发布日期时间戳         |
| `videoData.dimension`                     | Object  | 视频尺寸            |
| `videoData.subtitle`                      | Object  | 字幕信息            |
| `videoData.subtitle.allow_submit`         | Boolean | 是否允许提交字幕        |
| `videoData.subtitle.list`                 | Array   | 字幕列表数组          |
| `videoData.hasSubtitle`                   | Boolean | 是否有字幕           |
| `videoData.epid`                          | String  | EPID            |
| `videoData.subtitle_contents`             | Array   | 【必须】字幕内容数组      |
| `videoData.subtitle_contents[][]`         | Array   | 【必须】包含多个字幕片段的数组 |
| `videoData.subtitle_contents[][].from`    | Number  | 【必须】字幕开始时间      |
| `videoData.subtitle_contents[][].content` | String  | 【必须】字幕文本内容      |
| `user`                                    | Object  | 【必须】用户信息        |
| `user.username`                           | String  | 【必须】用户名         |
| `user.uid`                                | Number  | 【必须】UID         |
| `user.level`                              | Number  | 【必须】用户等级        |

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
