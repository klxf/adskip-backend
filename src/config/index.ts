import dotenv from 'dotenv';

dotenv.config();

export const config = {
    geminiApiKey: process.env.GEMINI_API_KEY as string,
    port: parseInt(process.env.PORT || '3000', 10),
    cors: {
        origin: (process.env.CORS_ORIGINS || 'http://localhost:8080,https://www.bilibili.com').split(','),
        methods: ['POST'],
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        apiHost: process.env.GEMINI_API_HOST || 'https://generativelanguage.googleapis.com',
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        generationConfig: {
            temperature: 0.25,
            topP: 1,
            responseMimeType: 'application/json',
        },
        systemInstruction: {
            parts:
                [
                    {
                        text: `你是一个字幕审核员，请你找出 JSON 格式字幕中的广告部分。JSON 中的 from 表示字幕的开始时间（秒），content 表示字幕的内容。
你需要返回一个 JSON，其中可以包含多个 adTimestamps 对象，start 表示广告字幕的开始时间，end 表示广告字幕的下一个字幕的开始时间，description 的格式固定“广告时间: mm:ss - mm:ss”，confidence 是置信度。
多个广告字幕连在一起则合并为一个 adTimestamps 对象，不要出现开始和结束时间相同的情况，更不要出现时间段相互重复的情况，如果两段广告字幕间出现了少量字幕则一同算作广告段。`,
                    },
                ]
        },
        responseSchema: {
            type: 'OBJECT',
            required: ["adTimestamps"],
            properties: {
                adTimestamps: {
                    type: 'ARRAY',
                    items: {
                        type: 'OBJECT',
                        required: ["start", "end", "description", "confidence"],
                        properties: {
                            start: {
                                type: 'NUMBER',
                            },
                            end: {
                                type: 'NUMBER',
                            },
                            description: {
                                type: 'STRING',
                            },
                            confidence: {
                                type: 'NUMBER',
                            },
                        },
                    },
                },
            },
        },
        customHeaders: (process.env.CUSTOM_HEADERS ? JSON.parse(process.env.CUSTOM_HEADERS) : {}) as Record<string, string>,
    },
};
