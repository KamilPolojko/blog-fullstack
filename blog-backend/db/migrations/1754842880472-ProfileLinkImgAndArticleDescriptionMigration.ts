import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileLinkImgAndArticleDescriptionMigration1754842880472
  implements MigrationInterface
{
  name = 'ProfileLinkImgAndArticleDescriptionMigration1754842880472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "description" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD "linkIImage" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "linkIImage"`);
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "description"`);
  }
}
