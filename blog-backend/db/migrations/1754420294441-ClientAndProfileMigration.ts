import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientAndProfileMigration1754420294441
  implements MigrationInterface
{
  name = 'ClientAndProfileMigration1754420294441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."profiles_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "gender" "public"."profiles_gender_enum" NOT NULL DEFAULT 'OTHER', "dateOfBirth" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "public"."clients_gender_enum"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "clients" ADD "profileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "UQ_4cc48db2edde4703f76fc15ec40" UNIQUE ("profileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "FK_4cc48db2edde4703f76fc15ec40" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "FK_4cc48db2edde4703f76fc15ec40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "UQ_4cc48db2edde4703f76fc15ec40"`,
    );
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "profileId"`);
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "dateOfBirth" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."clients_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "gender" "public"."clients_gender_enum" NOT NULL DEFAULT 'OTHER'`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "lastName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "firstName" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TYPE "public"."profiles_gender_enum"`);
  }
}
