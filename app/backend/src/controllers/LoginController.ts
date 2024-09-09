import { Request, Response } from 'express';
import loginService from '../services/LoginService';
import mapStatusHTTP from '../utils/mapStatusHttp';

async function login(req: Request, res: Response) {
  try {
    const serviceResponse = await loginService.verifyLogin(req.body);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    res.status(200).json(serviceResponse.data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function fetchUser(req: Request, res: Response) {
  const user = req.headers;

  res.status(200).json({ role: user.role });
}

export default {
  login,
  fetchUser,
};
