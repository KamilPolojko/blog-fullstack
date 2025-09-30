import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleCreatedAtANDisActiveColumnNameFixMigration1757594815049
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const createdAtExists = await queryRunner.hasColumn(
      'articles',
      'created_at',
    );
    const isActiveExists = await queryRunner.hasColumn('articles', 'is_active');

    if (!createdAtExists) {
      await queryRunner.query(
        `ALTER TABLE "articles" ADD "created_at" TIMESTAMP`,
      );

      const hasOldCreatedAt = await queryRunner.hasColumn(
        'articles',
        'createdAt',
      );
      const hasOldCreatedat = await queryRunner.hasColumn(
        'articles',
        'createdat',
      );

      if (hasOldCreatedAt) {
        await queryRunner.query(
          `UPDATE "articles" SET "created_at" = "createdAt"`,
        );
      } else if (hasOldCreatedat) {
        await queryRunner.query(
          `UPDATE "articles" SET "created_at" = "createdat"`,
        );
      } else {
        await queryRunner.query(
          `UPDATE "articles" SET "created_at" = CURRENT_TIMESTAMP WHERE "created_at" IS NULL`,
        );
      }

      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "created_at" SET NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`,
      );

      if (hasOldCreatedAt) {
        await queryRunner.query(
          `ALTER TABLE "articles" DROP COLUMN "createdAt"`,
        );
      } else if (hasOldCreatedat) {
        await queryRunner.query(
          `ALTER TABLE "articles" DROP COLUMN "createdat"`,
        );
      }
    }

    if (!isActiveExists) {
      await queryRunner.query(`ALTER TABLE "articles" ADD "is_active" BOOLEAN`);

      const hasOldIsActive = await queryRunner.hasColumn(
        'articles',
        'isActive',
      );
      const hasOldIsactive = await queryRunner.hasColumn(
        'articles',
        'isactive',
      );

      if (hasOldIsActive) {
        await queryRunner.query(
          `UPDATE "articles" SET "is_active" = "isActive"`,
        );
      } else if (hasOldIsactive) {
        await queryRunner.query(
          `UPDATE "articles" SET "is_active" = "isactive"`,
        );
      } else {
        await queryRunner.query(
          `UPDATE "articles" SET "is_active" = true WHERE "is_active" IS NULL`,
        );
      }

      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "is_active" SET NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "is_active" SET DEFAULT true`,
      );

      if (hasOldIsActive) {
        await queryRunner.query(
          `ALTER TABLE "articles" DROP COLUMN "isActive"`,
        );
      } else if (hasOldIsactive) {
        await queryRunner.query(
          `ALTER TABLE "articles" DROP COLUMN "isactive"`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const createdAtExists = await queryRunner.hasColumn(
      'articles',
      'created_at',
    );
    const isActiveExists = await queryRunner.hasColumn('articles', 'is_active');

    if (createdAtExists) {
      await queryRunner.query(
        `ALTER TABLE "articles" ADD "createdAt" TIMESTAMP`,
      );
      await queryRunner.query(
        `UPDATE "articles" SET "createdAt" = "created_at"`,
      );

      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "createdAt" SET NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
      );
      await queryRunner.query(
        `ALTER TABLE "articles" DROP COLUMN "created_at"`,
      );
    }

    if (isActiveExists) {
      await queryRunner.query(`ALTER TABLE "articles" ADD "isActive" BOOLEAN`);
      await queryRunner.query(`UPDATE "articles" SET "isActive" = "is_active"`);
      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "isActive" SET NOT NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "articles" ALTER COLUMN "isActive" SET DEFAULT true`,
      );
      await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "is_active"`);
    }
  }
}
