/*
  Warnings:

  - Changed the type of `event_type` on the `event_table` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONFERENCE', 'SEMINAR', 'WORKSHOP', 'WEBINAR', 'MEETUP', 'PANEL', 'TALK', 'TRAINING', 'COMPETITION', 'FESTIVAL', 'CONCERT', 'PERFORMANCE', 'EXHIBITION', 'SPORTS', 'FUNDRAISER', 'NETWORKING', 'CEREMONY', 'PARTY');

-- AlterTable
ALTER TABLE "event_table" DROP COLUMN "event_type",
ADD COLUMN     "event_type" "EventType" NOT NULL;
