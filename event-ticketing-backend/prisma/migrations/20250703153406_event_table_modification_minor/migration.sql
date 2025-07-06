/*
  Warnings:

  - Added the required column `expires_at` to the `event_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_table" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
