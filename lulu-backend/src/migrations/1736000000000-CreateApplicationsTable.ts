import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateApplicationsTable1736000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'projectId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Foreign key para projects
    await queryRunner.createForeignKey(
      'applications',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
        onDelete: 'CASCADE',
      }),
    );

    // Índice único em (projectId, name)
    await queryRunner.createIndex(
      'applications',
      new TableIndex({
        name: 'IDX_APPLICATIONS_PROJECT_NAME',
        columnNames: ['projectId', 'name'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.dropIndex(
      'applications',
      'IDX_APPLICATIONS_PROJECT_NAME',
    );

    // Remover foreign key
    const table = await queryRunner.getTable('applications');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('projectId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('applications', foreignKey);
    }

    // Remover tabela
    await queryRunner.dropTable('applications');
  }
}

