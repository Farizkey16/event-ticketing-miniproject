/*
  Warnings:

  - The values [done] on the enum `transactions_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "transactions_status_new" AS ENUM ('waiting_for_payment', 'waiting_for_admin_confirmation', 'rejected', 'accepted', 'expired', 'canceled');
ALTER TABLE "transactions_table" ALTER COLUMN "status" TYPE "transactions_status_new" USING ("status"::text::"transactions_status_new");
ALTER TYPE "transactions_status" RENAME TO "transactions_status_old";
ALTER TYPE "transactions_status_new" RENAME TO "transactions_status";
DROP TYPE "transactions_status_old";
COMMIT;
