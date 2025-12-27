import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LinkUserDto {
  @ApiProperty({
    description: 'ID do usuário a ser vinculado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsString({ message: 'ID do usuário deve ser uma string' })
  @IsUUID('4', { message: 'ID do usuário deve ser um UUID válido' })
  userId: string;
}

