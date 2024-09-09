import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import validateToken from '../middlewares/validateToken';

const loginRouter = Router();

loginRouter.post('/', (req, res) => LoginController.login(req, res));
loginRouter.get('/role', validateToken, LoginController.fetchUser);

export default loginRouter;
