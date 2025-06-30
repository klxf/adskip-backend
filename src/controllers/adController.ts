import { Request, Response } from 'express';
import { geminiService } from '../services/geminiService';

export const adController = {
    detectAds: async (req: Request, res: Response): Promise<void> => {
        const { videoData, user } = req.body;

        console.log('Bilibili User: ' + user.username + ' (' + user.uid + ')');
        console.log('Video:', videoData.bvid, videoData.title);

        if (!videoData || !videoData.subtitle_contents) {
            res.status(400).json({ error: 'Missing videoData or subtitle_contents in request body.' });
            return;
        }

        const subtitleContents = JSON.stringify(videoData.subtitle_contents);

        try {
            const geminiResponse = await geminiService.getAdTimestamps(subtitleContents);
            const DetectedResult = {
                success: true,
                videoId: videoData.bvid,
                hasAds: geminiResponse && geminiResponse.length > 0,
                adTimestamps: geminiResponse || [],
                message: 'Ad detection completed successfully.',
                confidence: geminiResponse && geminiResponse.length > 0 ? geminiResponse.reduce((sum: any, ad: { confidence: any; }) => sum + (ad.confidence || 0), 0) / (geminiResponse.length || 1) : 0,
                fromCache: false,
                requestId: videoData.bvid + '-' + new Date().getTime(),
            }
            console.log(DetectedResult.requestId, DetectedResult.hasAds ? '[Ads detected]' : '[No ads detected]');
            res.status(200).json(DetectedResult);
            return;
        } catch (error: any) {
            console.error('Error in ad detection:', error.message);
            res.status(500).json({ error: 'Internal server error.', details: error.message });
            return;
        }
    },
};
