import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleChangeToCloudinaryPublicIdMigration1754524889266
  implements MigrationInterface
{
  name = 'ArticleChangeToCloudinaryPublicIdMigration1754524889266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" RENAME COLUMN "deleteUrl" TO "cloudinaryPublicId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" RENAME COLUMN "cloudinaryPublicId" TO "deleteUrl"`,
    );
  }
}
