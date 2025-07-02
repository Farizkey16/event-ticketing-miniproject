/*
  Warnings:

  - You are about to drop the column `is_admin` on the `organizer_account` table. All the data in the column will be lost.
  - Added the required column `role` to the `organizer_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizer_account" DROP COLUMN "is_admin",
ADD COLUMN     "role" "ACCOUNT_ROLE" NOT NULL;
