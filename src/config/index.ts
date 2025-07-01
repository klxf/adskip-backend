import dotenv from 'dotenv';

dotenv.config();

export const config = {
    geminiApiKey: process.env.GEMINI_API_KEY as string,
    port: parseInt(process.env.PORT || '3000', 10),
    bodyLimit: process.env.BODY_LIMIT || '100kb',
    cors: {
        origin: (process.env.CORS_ORIGINS || 'http://localhost:8080,https://www.bilibili.com').split(','),
        methods: ['POST', 'GET', 'OPTIONS'],
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
                        text: `You are a professional subtitle reviewer. Your task is to identify advertising segments within JSON-formatted subtitles.

**Here's how to define and identify an advertisement:**

* **Explicit Promotional Language:** Look for direct calls to action, sales pitches, or clear product/service endorsements. Examples include phrases like "点击链接购买" (click the link to buy), "限时优惠" (limited-time offer), "立即下载" (download now), specific brand names followed by promotional statements, or overt mentions of "广告" (advertisement).
* **Commercial Jingles/Slogans:** Identify short musical pieces or catchy phrases that are clearly designed for brand recall or product promotion.
* **Out-of-Context Promotions:** Look for content that feels like an interruption to the main narrative, specifically inserted to promote something.
* **Avoid:** Do **not** flag general background music, incidental mentions of common products (e.g., "喝杯咖啡" - having a cup of coffee), or song lyrics that do not contain explicit promotional language as advertisements. **Assume song lyrics are NOT ads unless they contain clear, direct promotional content.**

---

**Your task is to return a JSON object with the following structure:**

The JSON should contain an array of \`adTimestamps\` objects. Each \`adTimestamps\` object should have:

* \`start\`: The beginning timestamp of the advertisement segment (in seconds).
* \`end\`: The timestamp of the first non-advertisement subtitle *after* the ad segment.
* \`description\`: A fixed format string: "广告时间: mm:ss - mm:ss" (convert seconds to mm:ss format).
* \`confidence\`: A numerical value (0.0-1.0) indicating the certainty that the segment is an advertisement. Higher confidence for explicit mentions (e.g., "广告"), lower for more subtle promotional language.

**Important Rules for \`adTimestamps\`:**

* **Merge Consecutive Ads:** If multiple advertisement subtitles appear consecutively, or if there are only a few non-ad subtitles (e.g., 1-2 short lines) between clear ad segments, merge them into a single \`adTimestamps\` object.
* **No Overlap/Identical Times:** Ensure that no \`adTimestamps\` objects have identical start and end times, or overlapping time ranges.
* **Small Gaps Included:** If a small number of non-advertising subtitles appear between two clear advertising segments, treat the entire duration as one consolidated advertisement block.
* **No Ads**：If no ads, only return \`[]\`.

**Example JSON Output**

\`\`\`json
[{"start":10,"end":45,"description":"广告时间: 00:10 - 00:45","confidence":0.9},{"start":120,"end":180,"description":"广告时间: 02:00 - 03:00","confidence":0.8}]
\`\`\``,
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
