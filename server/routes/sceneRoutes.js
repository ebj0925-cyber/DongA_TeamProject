import { Router } from 'express';
import { getSceneList } from '../controllers/sceneController.js';

const router = Router();

router.get('/', getSceneList);

export default router;
