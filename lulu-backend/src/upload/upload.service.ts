import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { TestRunCase } from '../testrun/models/testrun-case.entity';
import type { MulterFile } from './types/multer-file.type';

@Injectable()
export class UploadService {
  private readonly uploadsDir = join(process.cwd(), 'uploads', 'test-runs');

  constructor(
    @InjectRepository(TestRunCase)
    private readonly testRunCaseRepository: Repository<TestRunCase>,
  ) {
    // Garantir que o diretório de uploads existe
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async validateFile(file: MulterFile): Promise<void> {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de arquivo não permitido. Apenas imagens (jpg, jpeg, png, gif, webp) são aceitas.',
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        'Arquivo muito grande. Tamanho máximo permitido: 5MB',
      );
    }
  }

  async uploadImage(
    testRunCaseId: string,
    file: MulterFile,
  ): Promise<{ url: string; filename: string }> {
    // Validar arquivo
    await this.validateFile(file);

    // Verificar se TestRunCase existe
    const testRunCase = await this.testRunCaseRepository.findOne({
      where: { id: testRunCaseId },
      relations: ['testRun'],
    });

    if (!testRunCase) {
      throw new NotFoundException('Caso de teste não encontrado');
    }

    // Criar estrutura de pastas: uploads/test-runs/{testRunId}/{testRunCaseId}/
    const testRunId = testRunCase.testRunId;
    const caseDir = join(this.uploadsDir, testRunId, testRunCaseId);

    if (!existsSync(caseDir)) {
      mkdirSync(caseDir, { recursive: true });
    }

    // Gerar nome único para o arquivo (UUID + extensão original)
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = join(caseDir, filename);

    // Salvar arquivo
    writeFileSync(filePath, file.buffer);

    // Retornar URL relativa para acesso
    const url = `/uploads/test-runs/${testRunId}/${testRunCaseId}/${filename}`;

    return { url, filename };
  }

  getUploadPath(): string {
    return this.uploadsDir;
  }
}

