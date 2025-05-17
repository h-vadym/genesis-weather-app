import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscription1747316334367 implements MigrationInterface {
  name = 'CreateSubscription1747316334367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_frequency_enum" AS ENUM('hourly', 'daily')
        `);
    await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "email" character varying NOT NULL,
                "city" character varying NOT NULL,
                "frequency" "public"."subscriptions_frequency_enum" NOT NULL,
                "confirmed" boolean NOT NULL DEFAULT false,
                "confirmToken" uuid,
                "unsubscribeToken" uuid,
                CONSTRAINT "UQ_7ae04c5c70e36d8f7ef44d8a25d" UNIQUE ("confirmToken"),
                CONSTRAINT "UQ_fbeeac007acbb955e64c1d1bfff" UNIQUE ("unsubscribeToken"),
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f0558bf43d14f66844255e8b7c" ON "subscriptions" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_19e90c984f928e8b6a7b1ea396" ON "subscriptions" ("city")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_19e90c984f928e8b6a7b1ea396"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f0558bf43d14f66844255e8b7c"
        `);
    await queryRunner.query(`
            DROP TABLE "subscriptions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."subscriptions_frequency_enum"
        `);
  }
}
