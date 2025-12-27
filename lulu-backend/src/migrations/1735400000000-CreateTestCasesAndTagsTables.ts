import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTestCasesAndTagsTables1735400000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela tags
    await queryRunner.createTable(
      new Table({
        name: 'tags',
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

    // Índice único para name em tags
    await queryRunner.createIndex(
      'tags',
      new TableIndex({
        name: 'IDX_tags_name_unique',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    // Criar tabela testcases
    await queryRunner.createTable(
      new Table({
        name: 'testcases',
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
            name: 'testSuiteId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'severity',
            type: 'enum',
            enum: ['Blocker', 'Critical', 'Major', 'Minor', 'Trivial'],
            default: "'Trivial'",
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Draft', 'Ready', 'Review', 'Deprecated', 'Active'],
            default: "'Active'",
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['High', 'Medium', 'Low'],
            default: "'Medium'",
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['Functional', 'Security', 'Performance', 'Usability'],
            default: "'Functional'",
            isNullable: false,
          },
          {
            name: 'isFlaky',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'milestone',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'userStoryLink',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'layer',
            type: 'enum',
            enum: ['E2E', 'API', 'Unit'],
            default: "'E2E'",
            isNullable: false,
          },
          {
            name: 'environment',
            type: 'enum',
            enum: ['Integration', 'Location'],
            default: "'Integration'",
            isNullable: false,
          },
          {
            name: 'automationStatus',
            type: 'enum',
            enum: ['Manual', 'Automated'],
            default: "'Manual'",
            isNullable: false,
          },
          {
            name: 'toBeAutomated',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'preConditions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'steps',
            type: 'text',
            isArray: true,
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

    // Foreign key para folders (testSuiteId)
    await queryRunner.createForeignKey(
      'testcases',
      new TableForeignKey({
        columnNames: ['testSuiteId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'folders',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key para users (createdBy)
    await queryRunner.createForeignKey(
      'testcases',
      new TableForeignKey({
        columnNames: ['createdBy'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Índice para testSuiteId
    await queryRunner.createIndex(
      'testcases',
      new TableIndex({
        name: 'IDX_testcases_testSuiteId',
        columnNames: ['testSuiteId'],
      }),
    );

    // Criar tabela testcase_tags (junção many-to-many)
    await queryRunner.createTable(
      new Table({
        name: 'testcase_tags',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'testCaseId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'tagId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Foreign key para testcases
    await queryRunner.createForeignKey(
      'testcase_tags',
      new TableForeignKey({
        columnNames: ['testCaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'testcases',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key para tags
    await queryRunner.createForeignKey(
      'testcase_tags',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    );

    // Índice único para evitar duplicatas
    await queryRunner.createIndex(
      'testcase_tags',
      new TableIndex({
        name: 'IDX_testcase_tags_unique',
        columnNames: ['testCaseId', 'tagId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'testcase_tags',
      'IDX_testcase_tags_unique',
    );
    await queryRunner.dropTable('testcase_tags');
    await queryRunner.dropIndex('testcases', 'IDX_testcases_testSuiteId');
    await queryRunner.dropTable('testcases');
    await queryRunner.dropIndex('tags', 'IDX_tags_name_unique');
    await queryRunner.dropTable('tags');
  }
}

