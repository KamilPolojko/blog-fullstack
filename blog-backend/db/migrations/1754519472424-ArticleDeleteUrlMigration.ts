import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleDeleteUrlMigration1754519472424
  implements MigrationInterface
{
  name = 'ArticleDeleteUrlMigration1754519472424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "deleteUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "deleteUrl"`);
  }
}
