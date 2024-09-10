import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/', (req, res) => MatchController.getAllMatches(req, res));
router.patch('/:id/finish', authMiddleware, MatchController.finishMatch);

export default router;
