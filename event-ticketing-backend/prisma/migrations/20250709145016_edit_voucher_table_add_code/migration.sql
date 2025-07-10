/*
  Warnings:

  - You are about to drop the column `used_at` on the `coupon_table` table. All the data in the column will be lost.
  - Added the required column `code` to the `voucher_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupon_table" DROP COLUMN "used_at";

-- AlterTable
ALTER TABLE "voucher_table" ADD COLUMN     "code" TEXT NOT NULL;
