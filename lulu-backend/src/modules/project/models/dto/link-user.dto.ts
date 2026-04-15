import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LinkUserDto {
  @ApiProperty({
    description: 'Email do usuário a ser vinculado',
    example: 'maria.santos@example.com',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Email do usuário é obrigatório' })
  @IsString({ message: 'Email do usuário deve ser uma string' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;
}
