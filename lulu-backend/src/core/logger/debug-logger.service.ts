import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DebugLoggerService {
  private readonly logger = new Logger(DebugLoggerService.name);
  private readonly isDebugEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    // Verificar se DEBUG_LOG está habilitado (true, 1, 'true', '1')
    const debugLog = this.configService.get<string>('DEBUG_LOG', 'false');
    this.isDebugEnabled =
      debugLog === 'true' ||
      debugLog === '1' ||
      debugLog === 'TRUE' ||
      debugLog === 'True';

    // Log de inicialização (sempre mostra, mesmo se debug estiver desativado)
    console.log(
      `[DebugLoggerService] DEBUG_LOG=${debugLog}, isEnabled=${this.isDebugEnabled}`,
    );
  }

  /**
   * Log de debug (apenas se DEBUG_LOG=true)
   */
  debug(context: string, message: string, data?: any): void {
    if (this.isDebugEnabled) {
      if (data) {
        this.logger.debug(`[${context}] ${message}`, JSON.stringify(data, null, 2));
      } else {
        this.logger.debug(`[${context}] ${message}`);
      }
    }
  }

  /**
   * Log de debug com formato de objeto
   */
  debugObject(context: string, message: string, obj: any): void {
    if (this.isDebugEnabled) {
      this.logger.debug(
        `[${context}] ${message}`,
        JSON.stringify(obj, null, 2),
      );
    }
  }

  /**
   * Log de debug para operações de banco de dados
   */
  debugDb(context: string, operation: string, data?: any): void {
    if (this.isDebugEnabled) {
      this.logger.debug(
        `[${context}] DB ${operation}`,
        data ? JSON.stringify(data, null, 2) : undefined,
      );
    }
  }

  /**
   * Log de debug para operações de linked list
   */
  debugLinkedList(
    context: string,
    operation: string,
    folderId: string,
    details?: any,
  ): void {
    if (this.isDebugEnabled) {
      this.logger.debug(
        `[${context}] Linked List ${operation} - Folder: ${folderId}`,
        details ? JSON.stringify(details, null, 2) : undefined,
      );
    }
  }

  /**
   * Verifica se debug está habilitado
   */
  isEnabled(): boolean {
    return this.isDebugEnabled;
  }
}

