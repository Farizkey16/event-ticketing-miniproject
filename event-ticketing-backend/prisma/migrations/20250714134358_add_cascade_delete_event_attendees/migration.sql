-- DropForeignKey
ALTER TABLE "event_attendees" DROP CONSTRAINT "event_attendees_event_id_fkey";

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
