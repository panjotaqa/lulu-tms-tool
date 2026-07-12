import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateBugsAndBugTagsTables1736200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bugs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bugId',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Open', 'InProgress', 'Resolved', 'Closed', 'Reopened'],
            default: "'Open'",
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
            name: 'priority',
            type: 'enum',
            enum: ['High', 'Medium', 'Low'],
            default: "'Medium'",
            isNullable: false,
          },
          {
            name: 'environment',
            type: 'enum',
            enum: ['Integration', 'Location'],
            isNullable: true,
          },
          {
            name: 'projectId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'applicationId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'testCaseId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'testRunCaseId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assignedToId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdById',
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

    await queryRunner.createForeignKey(
      'bugs',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bugs',
      new TableForeignKey({
        columnNames: ['applicationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'applications',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'bugs',
      new TableForeignKey({
        columnNames: ['testCaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'testcases',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'bugs',
      new TableForeignKey({
        columnNames: ['testRunCaseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'test_run_cases',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'bugs',
      new TableForeignKey({
        columnNames: ['assignedToId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'bugs',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'bugs',
      new TableIndex({
        name: 'IDX_BUGS_PROJECT_STATUS',
        columnNames: ['projectId', 'status'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'bug_tags',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bugId',
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

    await queryRunner.createForeignKey(
      'bug_tags',
      new TableForeignKey({
        columnNames: ['bugId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bugs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bug_tags',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'bug_tags',
      new TableIndex({
        name: 'IDX_BUG_TAGS_BUG_TAG_UNIQUE',
        columnNames: ['bugId', 'tagId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('bug_tags', 'IDX_BUG_TAGS_BUG_TAG_UNIQUE');
    const bugTagsTable = await queryRunner.getTable('bug_tags');
    if (bugTagsTable) {
      for (const fk of bugTagsTable.foreignKeys) {
        await queryRunner.dropForeignKey('bug_tags', fk);
      }
    }
    await queryRunner.dropTable('bug_tags');

    await queryRunner.dropIndex('bugs', 'IDX_BUGS_PROJECT_STATUS');
    const bugsTable = await queryRunner.getTable('bugs');
    if (bugsTable) {
      for (const fk of bugsTable.foreignKeys) {
        await queryRunner.dropForeignKey('bugs', fk);
      }
    }
    await queryRunner.dropTable('bugs');
  }
}
