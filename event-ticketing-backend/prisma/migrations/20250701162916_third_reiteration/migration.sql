/*
  Warnings:

  - You are about to drop the column `points_souce_id` on the `user_points` table. All the data in the column will be lost.
  - Changed the type of `role` on the `user_account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `points_source_id` to the `user_points` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ACCOUNT_ROLE" AS ENUM ('user', 'organizer', 'admin');

-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "role",
ADD COLUMN     "role" "ACCOUNT_ROLE" NOT NULL;

-- AlterTable
ALTER TABLE "user_points" DROP COLUMN "points_souce_id",
ADD COLUMN     "points_source_id" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "ROLE";
