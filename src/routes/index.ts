import { Router } from 'express';
import { adController } from '../controllers/adController';

const router = Router();

router.post('/detect-ads', adController.detectAds);

export default router;
