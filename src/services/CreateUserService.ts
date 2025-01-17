import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkIfUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkIfUserExists) throw new AppError('Email is already registered.');

    const hashedPass = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPass,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
