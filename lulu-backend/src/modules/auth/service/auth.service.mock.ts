import { IAuthService } from './auth.service.interface';

export const createAuthServiceMock = (): jest.Mocked<IAuthService> =>
  ({
    login: jest.fn(),
    logout: jest.fn(),
  }) as unknown as jest.Mocked<IAuthService>;
