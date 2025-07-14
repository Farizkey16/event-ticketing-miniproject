import { transactions_status, PrismaClient } from "./generated/client";
const prisma = new PrismaClient();

// 1. Status mapping: raw status -> enum
const statusMapper = {
  attended: transactions_status.accepted,
  attending: transactions_status.waiting_for_payment,
  cancelled: transactions_status.canceled,
  expired: transactions_status.expired,
};

// 2. Your raw dummy data
const rawData = [
  { event_id: 28, user_id: 13, total_price: 400000, status: "attended" },
  { event_id: 29, user_id: 14, total_price: 100000, status: "attending" },
  { event_id: 33, user_id: 15, total_price: 120000, status: "cancelled" },
  { event_id: 31, user_id: 16, total_price: 310000, status: "expired" },
  { event_id: 30, user_id: 17, total_price: 0, status: "attending" },
  { event_id: 37, user_id: 18, total_price: 0, status: "attended" },
  { event_id: 39, user_id: 19, total_price: 50000, status: "attended" },
  { event_id: 35, user_id: 20, total_price: 75000, status: "attending" },
  { event_id: 38, user_id: 21, total_price: 50000, status: "expired" },
  { event_id: 34, user_id: 22, total_price: 0, status: "attending" },
  { event_id: 33, user_id: 23, total_price: 200000, status: "attended" },
  { event_id: 28, user_id: 24, total_price: 400000, status: "cancelled" },
  { event_id: 29, user_id: 25, total_price: 100000, status: "attending" },
  { event_id: 32, user_id: 26, total_price: 0, status: "attended" },
  { event_id: 37, user_id: 27, total_price: 0, status: "attending" },
];

// 3. Transform into proper Prisma input format
const transactions = rawData.map((tx) => ({
  event_id: tx.event_id,
  user_id: tx.user_id,
  total_price: tx.total_price,
  status: statusMapper[tx.status as keyof typeof statusMapper],
  payment_proof_url: "/images/dummy.jpg", // default dummy proof
}));

// 4. Seed it
async function main() {
  await prisma.transactions_table.createMany({
    data: transactions,
    skipDuplicates: true,
  });
  console.log("🎉 Transactions seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
