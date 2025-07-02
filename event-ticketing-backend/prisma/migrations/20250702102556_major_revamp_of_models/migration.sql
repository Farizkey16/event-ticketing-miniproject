/*
  Warnings:

  - You are about to drop the column `coupon_amount` on the `coupon_table` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `coupon_table` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `coupon_table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `coupon_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_type` to the `coupon_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_value` to the `coupon_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issued_by` to the `coupon_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usage_limit` to the `coupon_table` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `coupon_table` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `event_attendees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `organizer_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `ticket_holds` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `transactions_table` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `discount_type` to the `voucher_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_value` to the `voucher_table` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "account_role" AS ENUM ('user', 'organizer', 'admin');

-- CreateEnum
CREATE TYPE "coupon_status" AS ENUM ('active', 'used', 'expired');

-- CreateEnum
CREATE TYPE "issuer" AS ENUM ('system', 'organizer', 'admin');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('attended', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "transactions_status" AS ENUM ('waiting_for_payment', 'waiting_for_admin_confirmation', 'rejected', 'done', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "discount_type" AS ENUM ('fixed', 'percentage');

-- DropForeignKey
ALTER TABLE "coupon_table" DROP CONSTRAINT "coupon_table_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions_table" DROP CONSTRAINT "transactions_table_voucher_id_fkey";

-- AlterTable
ALTER TABLE "coupon_table" DROP COLUMN "coupon_amount",
DROP COLUMN "user_id",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "discount_type" "discount_type" NOT NULL,
ADD COLUMN     "discount_value" INTEGER NOT NULL,
ADD COLUMN     "event_id" INTEGER,
ADD COLUMN     "issued_by" "issuer" NOT NULL,
ADD COLUMN     "usage_limit" INTEGER NOT NULL,
ADD COLUMN     "used_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "coupon_status" NOT NULL;

-- AlterTable
ALTER TABLE "event_attendees" DROP COLUMN "status",
ADD COLUMN     "status" "event_status" NOT NULL;

-- AlterTable
ALTER TABLE "event_table" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "organizer_account" DROP COLUMN "role",
ADD COLUMN     "role" "account_role" NOT NULL;

-- AlterTable
ALTER TABLE "organizer_reviews" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ticket_holds" DROP COLUMN "status",
ADD COLUMN     "status" "coupon_status" NOT NULL;

-- AlterTable
ALTER TABLE "transactions_table" ALTER COLUMN "voucher_id" DROP NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "transactions_status" NOT NULL;

-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "role",
ADD COLUMN     "role" "account_role" NOT NULL;

-- AlterTable
ALTER TABLE "voucher_table" ADD COLUMN     "discount_type" "discount_type" NOT NULL,
ADD COLUMN     "discount_value" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "ACCOUNT_ROLE";

-- DropEnum
DROP TYPE "EVENT_STATUS";

-- DropEnum
DROP TYPE "STATUS";

-- DropEnum
DROP TYPE "transactions_STATUS";

-- CreateTable
CREATE TABLE "user_coupon" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "user_coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_coupon_user_id_coupon_id_key" ON "user_coupon"("user_id", "coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_table_code_key" ON "coupon_table"("code");

-- AddForeignKey
ALTER TABLE "user_coupon" ADD CONSTRAINT "user_coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupon" ADD CONSTRAINT "user_coupon_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_table" ADD CONSTRAINT "transactions_table_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher_table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
