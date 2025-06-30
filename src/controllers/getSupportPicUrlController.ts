import { Request, Response } from 'express';

export const getSupportPicUrlController = {
    getPicUrl: async (req: Request, res: Response): Promise<void> => {
        try {
            const picUrl = {
                supportPicUrl: 'https://s2.loli.net/2025/06/30/DGvUVao2nrImOXS.webp',  // 虽然修改了，但仍然保留了原有的作者赞赏码
                supportType: 'donate',
                title: '支持开发者们',
                description: '如果此插件对您有帮助，请赞赏支持！记得留下B站id',
                altText: '赞赏码',
                enabled: true
            };

            res.status(200).json(picUrl);
        } catch (error: any) {
            console.error('Error fetching user stats:', error.message);
            res.status(500).json({ error: 'Internal server error.', details: error.message });
        }
    },
};
