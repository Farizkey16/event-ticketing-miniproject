/*
  Warnings:

  - Added the required column `total_price` to the `transactions_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions_table" ADD COLUMN     "coupon_id" INTEGER,
ADD COLUMN     "discount_applied" INTEGER,
ADD COLUMN     "total_price" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions_table" ADD CONSTRAINT "transactions_table_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon_table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
