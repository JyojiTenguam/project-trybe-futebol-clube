import { compareSync } from 'bcryptjs';
import jwtUtil from '../utils/jwt.util';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import UserModel from '../database/models/user.model';
import { Token, Login } from '../types/types';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const unauthorizedData = 'Invalid email or password';

async function verifyLogin(login: Login): Promise<ServiceResponse<Token>> {
  if (!login.email || !login.password) {
    return { status: 'INVALID_DATA', data: { message: 'All fields must be filled' } };
  }

  if (!isValidEmail(login.email)) {
    return { status: 'UNAUTHORIZED', data: { message: unauthorizedData } };
  }

  if (login.password.length < 6) {
    return { status: 'UNAUTHORIZED', data: { message: unauthorizedData } };
  }

  const foundUser = await UserModel.findOne({ where: { email: login.email } });

  if (!foundUser || !compareSync(login.password, foundUser.dataValues.password)) {
    return { status: 'UNAUTHORIZED', data: { message: unauthorizedData } };
  }

  const { id, email } = foundUser.dataValues;

  const token = jwtUtil.sign({ id, email });

  return { status: 'SUCCESSFUL', data: { token } };
}

export default {
  verifyLogin,
};
