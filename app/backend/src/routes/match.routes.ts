import { Router } from 'express';
import MatchController from '../controllers/MatchController';

const router = Router();

router.get('/', (req, res) => MatchController.getAllMatches(req, res));

export default router;
