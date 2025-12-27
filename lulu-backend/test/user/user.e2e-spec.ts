import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from 'src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('deve criar um usuário com dados válidos', () => {
      const createUserDto = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: 'senhaSegura123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body).not.toHaveProperty('password');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('deve retornar 400 quando email é inválido', () => {
      const createUserDto = {
        name: 'João Silva',
        email: 'email-invalido',
        password: 'senhaSegura123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('deve retornar 400 quando senha é muito curta', () => {
      const createUserDto = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: '12345',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('deve retornar 400 quando nome está faltando', () => {
      const createUserDto = {
        email: 'joao.silva@example.com',
        password: 'senhaSegura123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('deve retornar 400 quando email está faltando', () => {
      const createUserDto = {
        name: 'João Silva',
        password: 'senhaSegura123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('deve retornar 400 quando senha está faltando', () => {
      const createUserDto = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('deve retornar 409 quando email já está em uso', async () => {
      const createUserDto = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: 'senhaSegura123',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });
});

