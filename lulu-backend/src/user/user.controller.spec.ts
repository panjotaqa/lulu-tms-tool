import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar userService.create ao criar usuário', async () => {
    const createUserDto = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'senhaSegura123',
    };

    const expectedUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'João Silva',
      email: 'joao.silva@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserService.create.mockResolvedValue(expectedUser);

    const result = await controller.create(createUserDto);

    expect(service.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(expectedUser);
  });
});

