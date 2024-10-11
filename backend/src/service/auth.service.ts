import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/domain/entity/user.entity';
import { createUser, findUserOne } from '@/repository/user.repository';
import { HttpError } from '@/shared/errors/httpError';

export type SignUpParam = {
  username: string;
  email: string;
  password: string;
};

export const signUp = async ({ username, email, password }: SignUpParam) => {
  const existUser = await findUserOne({
    where: {
      email,
    },
  });
  if (existUser) {
    throw new HttpError(409, 'Other user already use this email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();
  user.name = username;
  user.email = email;
  user.password = hashedPassword;

  const createdUser = await createUser(user);

  const token = jwt.sign(
    { id: createdUser.id, email: createdUser.email },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '1h',
    },
  );
  return token;
};

export type SignInParam = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: SignInParam) => {
  const user = await findUserOne({
    where: {
      email,
    },
  });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new HttpError(401, 'Invalid password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '1h',
    },
  );
  return token;
};
