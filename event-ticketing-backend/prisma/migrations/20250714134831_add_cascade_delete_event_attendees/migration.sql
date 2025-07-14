-- DropForeignKey
ALTER TABLE "event_attendees" DROP CONSTRAINT "event_attendees_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "event_attendees" DROP CONSTRAINT "event_attendees_user_id_fkey";

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
