import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../config';

class GeminiService {
    private apiKey: string;
    private apiHost: string;
    private model: string;
    private generationConfig: typeof config.gemini.generationConfig;
    private systemInstruction: typeof config.gemini.systemInstruction;
    private responseSchema: typeof config.gemini.responseSchema;
    private customHeaders: Record<string, string> | undefined;

    constructor() {
        this.apiKey = config.gemini.apiKey;
        this.apiHost = config.gemini.apiHost;
        this.model = config.gemini.model;
        this.generationConfig = config.gemini.generationConfig;
        this.systemInstruction = config.gemini.systemInstruction;
        this.responseSchema = config.gemini.responseSchema;
        this.customHeaders = config.gemini.customHeaders || {};
    }

    /**
     * 与 Gemini API 交互以获取广告时间戳
     * @param subtitleContents 字幕内容，JSON 字符串格式
     * @returns Gemini API 返回的数据
     */
    async getAdTimestamps(subtitleContents: string): Promise<any> {
        const url = `${this.apiHost}/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

        const requestBody = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: subtitleContents,
                        },
                    ],
                },
            ],
            generationConfig: this.generationConfig,
            systemInstruction: this.systemInstruction,
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "extractAdTimestamps",
                            description: "Extracts ad timestamps and descriptions from subtitle contents.",
                            parameters: this.responseSchema
                        }
                    ]
                }
            ]
        };

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.customHeaders) {
            Object.assign(headers, this.customHeaders);
        }

        const axiosConfig: AxiosRequestConfig = {
            method: 'POST',
            url: url,
            data: requestBody,
            headers: headers,
        };

        try {
            const response = await axios(axiosConfig);
            const geminiData = response.data;

            if (geminiData && geminiData.candidates && geminiData.candidates.length > 0) {
                const textPart = geminiData.candidates[0].content.parts[0].text;
                try {
                    return JSON.parse(textPart);
                } catch (parseError) {
                    console.warn('Gemini response is not a valid JSON string, returning raw text:', textPart);
                    return { rawResponse: textPart };
                }
            } else {
                console.warn('Unexpected Gemini response structure:', geminiData);
                return { error: 'Unexpected Gemini response structure', data: geminiData };
            }
        } catch (error: any) {
            console.error('Error calling Gemini API:', error.message);
            if (error.response) {
                console.error('Gemini API Response Error Data:', error.response.data);
                console.error('Gemini API Response Status:', error.response.status);
                console.error('Gemini API Response Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Gemini API Request Error (no response received):', error.request);
            } else {
                console.error('Gemini API Request Setup Error:', error.message);
            }
            throw new Error(`Failed to get data from Gemini API: ${error.message}`);
        }
    }
}

export const geminiService = new GeminiService();
