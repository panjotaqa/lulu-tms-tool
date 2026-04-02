import { User } from './user.entity';

export const userEntityMock: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Usuário Teste',
  email: 'email_teste@teste.com',
  password: 'password123',
  createdAt: new Date(),
  updatedAt: new Date(),
};
