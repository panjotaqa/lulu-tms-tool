import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UnlinkUserDto {
  @ApiProperty({
    description: 'ID do usuário a ser desvinculado',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @IsString({ message: 'ID do usuário deve ser uma string' })
  @IsUUID('4', { message: 'ID do usuário deve ser um UUID válido' })
  userId: string;
}
