import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateFoldersTable1735300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'folders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'position',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'projectId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'parentFolderId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdBy',
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
      'folders',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key para parentFolder (self-reference)
    await queryRunner.createForeignKey(
      'folders',
      new TableForeignKey({
        columnNames: ['parentFolderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'folders',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key para users (createdBy)
    await queryRunner.createForeignKey(
      'folders',
      new TableForeignKey({
        columnNames: ['createdBy'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Índice composto para performance
    await queryRunner.createIndex(
      'folders',
      new TableIndex({
        name: 'IDX_folders_project_parent_position',
        columnNames: ['projectId', 'parentFolderId', 'position'],
      }),
    );

    // Índice único para garantir unicidade de posição por nível
    await queryRunner.createIndex(
      'folders',
      new TableIndex({
        name: 'IDX_folders_project_parent_position_unique',
        columnNames: ['projectId', 'parentFolderId', 'position'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('folders', 'IDX_folders_project_parent_position_unique');
    await queryRunner.dropIndex('folders', 'IDX_folders_project_parent_position');
    await queryRunner.dropTable('folders');
  }
}

