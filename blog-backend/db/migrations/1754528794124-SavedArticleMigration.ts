import { MigrationInterface, QueryRunner } from 'typeorm';

export class SavedArticleMigration1754528794124 implements MigrationInterface {
  name = 'SavedArticleMigration1754528794124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "saved_articles" ("client_id" uuid NOT NULL, "article_id" uuid NOT NULL, CONSTRAINT "PK_b7b3d5b69c910661c6ef30e4ca0" PRIMARY KEY ("client_id", "article_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b015a18423db909e9fd0b48a60" ON "saved_articles" ("client_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e22a09c311adaa46656394c1bd" ON "saved_articles" ("article_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_articles" ADD CONSTRAINT "FK_b015a18423db909e9fd0b48a60c" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_articles" ADD CONSTRAINT "FK_e22a09c311adaa46656394c1bda" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_articles" DROP CONSTRAINT "FK_e22a09c311adaa46656394c1bda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_articles" DROP CONSTRAINT "FK_b015a18423db909e9fd0b48a60c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e22a09c311adaa46656394c1bd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b015a18423db909e9fd0b48a60"`,
    );
    await queryRunner.query(`DROP TABLE "saved_articles"`);
  }
}
