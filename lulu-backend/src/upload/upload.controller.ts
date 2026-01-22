import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import type { MulterFile } from './types/multer-file.type';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('test-run-case/:testRunCaseId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload de imagem para evidência de caso de teste',
    description:
      'Faz upload de uma imagem que será usada como evidência em um caso de teste. Apenas imagens são aceitas (jpg, jpeg, png, gif, webp) com tamanho máximo de 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'testRunCaseId',
    type: String,
    description: 'ID do caso de teste na execução',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Imagem enviada com sucesso',
    schema: {
      example: {
        url: '/uploads/test-runs/test-run-id/test-run-case-id/filename.jpg',
        filename: 'filename.jpg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido (tipo não permitido ou tamanho excedido)',
  })
  @ApiResponse({
    status: 404,
    description: 'Caso de teste não encontrado',
  })
  async uploadImage(
    @Param('testRunCaseId') testRunCaseId: string,
    @UploadedFile() file: MulterFile | undefined,
  ) {
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    return this.uploadService.uploadImage(testRunCaseId, file);
  }
}

