import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { User } from '../models/entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneWithoutPass(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt'],
    });
  }
}
