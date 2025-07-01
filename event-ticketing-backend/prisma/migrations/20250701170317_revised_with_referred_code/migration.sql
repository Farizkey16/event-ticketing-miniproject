/*
  Warnings:

  - You are about to drop the column `referred_by_user_id` on the `user_account` table. All the data in the column will be lost.
  - Added the required column `referred_by_code` to the `user_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "referred_by_user_id",
ADD COLUMN     "referred_by_code" TEXT NOT NULL;
