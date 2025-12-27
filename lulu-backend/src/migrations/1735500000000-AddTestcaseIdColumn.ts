import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddTestcaseIdColumn1735500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna testcaseId (nullable inicialmente para permitir povoamento)
    await queryRunner.addColumn(
      'testcases',
      new TableColumn({
        name: 'testcaseId',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );

    // Criar índice único (permitindo nulls temporariamente)
    await queryRunner.createIndex(
      'testcases',
      new TableIndex({
        name: 'IDX_testcases_testcaseId_unique',
        columnNames: ['testcaseId'],
        isUnique: true,
        where: '"testcaseId" IS NOT NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('testcases', 'IDX_testcases_testcaseId_unique');
    await queryRunner.dropColumn('testcases', 'testcaseId');
  }
}

