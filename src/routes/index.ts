import { Router } from 'express';
import { adController } from '../controllers/adController';
import { userStatsController } from "../controllers/userStatsController";
import { getSupportPicUrlController } from "../controllers/getSupportPicUrlController";

const router = Router();

router.post('/detect', adController.detectAds);
router.post('/user/stats', userStatsController.getStats);
router.get('/getSupportPicUrl', getSupportPicUrlController.getPicUrl);

export default router;
