import ensureAuthenticated from '../middlewares/auth.js';
import express from 'express';
import {aiController} from '../controllers/aiController.js';

const router = express.Router();

// router.post("/", ensureAuthenticated,aiController);
router.post("/",aiController);

export default router;
