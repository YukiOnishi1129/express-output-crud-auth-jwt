import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/domain/entity/user.entity';
import { createUser } from '@/repository/user.repository';

export type SignUpParam = {
  username: string;
  email: string;
  password: string;
};

export const signUp = async ({ username, email, password }: SignUpParam) => {
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
