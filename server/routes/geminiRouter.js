import ensureAuthenticated from '../middlewares/auth.js';
import express from 'express';
import {aiController} from '../controllers/aiController.js';

const router = express.Router();

router.get("/gemini", ensureAuthenticated,aiController);

export default router;
