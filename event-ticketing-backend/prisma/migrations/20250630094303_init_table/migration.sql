-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('user', 'organizer', 'admin');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('active', 'used', 'expired');

-- CreateEnum
CREATE TYPE "EVENT_STATUS" AS ENUM ('attended', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "transactions_STATUS" AS ENUM ('waiting_for_payment', 'waiting_for_admin_confirmation', 'rejected', 'done', 'expired', 'canceled');

-- CreateTable
CREATE TABLE "user_account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL,
    "referral_code" TEXT NOT NULL,
    "referred_by_user_id" TEXT NOT NULL,
    "imgProfile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_fullname" TEXT NOT NULL,
    "user_date_of_birth" TIMESTAMP(3) NOT NULL,
    "user_phone" INTEGER NOT NULL,
    "user_profile_image" TEXT NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_points" (
    "id" SERIAL NOT NULL,
    "points" INTEGER NOT NULL,
    "points_source_type" TEXT NOT NULL,
    "points_souce_id" INTEGER NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "points_remaining" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_redemption" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "redeemed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "points_redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_redemption_items" (
    "id" SERIAL NOT NULL,
    "user_point_id" INTEGER NOT NULL,
    "redemption_id" INTEGER NOT NULL,

    CONSTRAINT "points_redemption_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_table" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "status" "STATUS" NOT NULL,
    "coupon_amount" INTEGER NOT NULL,

    CONSTRAINT "coupon_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL,

    CONSTRAINT "organizer_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_profile" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "organizer_name" TEXT NOT NULL,
    "organizer_address" TEXT NOT NULL,
    "organizer_phone" INTEGER NOT NULL,
    "organizer_profile_image" TEXT NOT NULL,

    CONSTRAINT "organizer_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_reviews" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizer_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_table" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "seat_capacity" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_holds" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ticket_type_id" INTEGER NOT NULL,
    "ticket_quantity" INTEGER NOT NULL,
    "held_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "transactions_id" INTEGER NOT NULL,
    "status" "STATUS" NOT NULL,

    CONSTRAINT "ticket_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_type" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "type_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,

    CONSTRAINT "ticket_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendees" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ticket_quantity" INTEGER NOT NULL,
    "total_price_paid" INTEGER NOT NULL,
    "status" "EVENT_STATUS" NOT NULL,

    CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions_table" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "status" "transactions_STATUS" NOT NULL,
    "payment_proof_url" TEXT NOT NULL,

    CONSTRAINT "transactions_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_table" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "usage_limit" INTEGER NOT NULL,

    CONSTRAINT "voucher_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_username_key" ON "user_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_referral_code_key" ON "user_account"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_user_id_key" ON "user_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "points_redemption_items_user_point_id_redemption_id_key" ON "points_redemption_items"("user_point_id", "redemption_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_account_email_key" ON "organizer_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_profile_organizer_id_key" ON "organizer_profile"("organizer_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendees_event_id_user_id_key" ON "event_attendees"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_points" ADD CONSTRAINT "user_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_redemption" ADD CONSTRAINT "points_redemption_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_redemption_items" ADD CONSTRAINT "points_redemption_items_user_point_id_fkey" FOREIGN KEY ("user_point_id") REFERENCES "user_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_redemption_items" ADD CONSTRAINT "points_redemption_items_redemption_id_fkey" FOREIGN KEY ("redemption_id") REFERENCES "points_redemption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_table" ADD CONSTRAINT "coupon_table_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_profile" ADD CONSTRAINT "organizer_profile_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_reviews" ADD CONSTRAINT "organizer_reviews_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_reviews" ADD CONSTRAINT "organizer_reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_reviews" ADD CONSTRAINT "organizer_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_table" ADD CONSTRAINT "event_table_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_holds" ADD CONSTRAINT "ticket_holds_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_holds" ADD CONSTRAINT "ticket_holds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_holds" ADD CONSTRAINT "ticket_holds_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_holds" ADD CONSTRAINT "ticket_holds_transactions_id_fkey" FOREIGN KEY ("transactions_id") REFERENCES "transactions_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_type" ADD CONSTRAINT "ticket_type_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_table" ADD CONSTRAINT "transactions_table_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_table" ADD CONSTRAINT "transactions_table_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_table" ADD CONSTRAINT "transactions_table_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "voucher_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_table" ADD CONSTRAINT "voucher_table_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizer_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_table" ADD CONSTRAINT "voucher_table_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
