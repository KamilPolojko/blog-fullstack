import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleImageLinkColumnMigration1754500962256
  implements MigrationInterface
{
  name = 'ArticleImageLinkColumnMigration1754500962256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "linkIImage" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "linkIImage"`);
  }
}
