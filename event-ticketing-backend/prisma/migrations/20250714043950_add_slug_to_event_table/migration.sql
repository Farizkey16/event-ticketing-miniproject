/*
  Warnings:

  - Added the required column `slug` to the `event_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_table" ADD COLUMN     "slug" TEXT NOT NULL;
