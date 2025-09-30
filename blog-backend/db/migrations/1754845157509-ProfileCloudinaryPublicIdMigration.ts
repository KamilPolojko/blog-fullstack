import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileCloudinaryPublicIdMigration1754845157509
  implements MigrationInterface
{
  name = 'ProfileCloudinaryPublicIdMigration1754845157509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD "cloudinaryPublicId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP COLUMN "cloudinaryPublicId"`,
    );
  }
}
