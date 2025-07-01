import { Request, Response } from 'express';

export const userStatsController = {
    getStats: async (req: Request, res: Response): Promise<void> => {
        const { uid, level, vipType, vipDueDate, local_popup_opens, local_share_clicks } = req.body;

        try {
            const userStats = {
                uid,
                bili_level: level,
                account_type: -1,
                account_type_display: '私有部署<br>',
                vip_type: vipType,
                vip_due_date: new Date(vipDueDate).toISOString(),
                is_vip_active: vipType !== 0 && new Date(vipDueDate) > new Date(),
                is_in_trial_period: true,
                trial_end_date: '2099-12-31',
                base_limit_from_level: 999,
                trial_bonus: 0,
                vip_bonus: 0,
                daily_gemini_requests_used: 0,
                daily_gemini_limit: 999,
                total_videos_processed: 0,
                total_video_duration_processed_display: "00:00:00",
                total_ads_duration_display: "私有部署暂不支持",
                total_videos_with_ads: 10,
                local_popup_opens: local_popup_opens,
                local_share_clicks: local_share_clicks,
                message: '获取成功'
            };

            res.status(200).json(userStats);
        } catch (error: any) {
            console.error('Error fetching user stats:', error.message);
            res.status(500).json({ error: 'Internal server error.', details: error.message });
        }
    },
};
