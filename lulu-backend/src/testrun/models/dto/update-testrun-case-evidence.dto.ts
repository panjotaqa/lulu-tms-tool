import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTestRunCaseEvidenceDto {
  @ApiProperty({
    description: 'Conteúdo em Markdown das evidências do caso de teste',
    example: '# Evidências\n\n![Screenshot](url-da-imagem.png)\n\nTeste executado com sucesso.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Evidências devem ser uma string' })
  evidence?: string | null;
}

