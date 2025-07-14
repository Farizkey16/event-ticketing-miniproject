export type Attendee = {
  id: number;
  eventName: string;
  userName: string;
  ticketQuantity: number;
  totalPricePaid: number;
  status: "attending" | "attended" | "expired" | "cancelled";
};


export const sampleAttendees: Attendee[] = [

    // all organizer_id: 5
  {
    id: 1,
    eventName: "Week Me Up Music Festival 2025", // event_id: 28
    userName: "Budi Santoso",
    ticketQuantity: 2,
    totalPricePaid: 400000,
    status: "attended",
  },
  {
    id: 2,
    eventName: "Collab Music Fest 2025", // event_id: 29
    userName: "Siti Aminah",
    ticketQuantity: 1,
    totalPricePaid: 100000,
    status: "attending",
  },
  {
    id: 3,
    eventName: "Jakarta Fair 2025", // event_id: 33
    userName: "Agus Hermawan",
    ticketQuantity: 3,
    totalPricePaid: 120000,
    status: "cancelled",
  },
  {
    id: 4,
    eventName: "Bandung Soundwave 2025", // event_id: 31
    userName: "Ratna Putri",
    ticketQuantity: 2,
    totalPricePaid: 310000,
    status: "expired",
  },
  {
    id: 5,
    eventName: "Festival Kuliner Bandung 2025", // event_id: 30
    userName: "Indra Kurniawan",
    ticketQuantity: 4,
    totalPricePaid: 0,
    status: "attending",
  },
  {
    id: 6,
    eventName: "Surabaya Music Parade 2025", // event_id: 37
    userName: "Maya Rachmawati",
    ticketQuantity: 2,
    totalPricePaid: 0,
    status: "attended",
  },
  {
    id: 7,
    eventName: "Yogya Couple Run 2025", // event_id: 39
    userName: "Rahmat & Nurul",
    ticketQuantity: 2,
    totalPricePaid: 50000,
    status: "attended",
  },
  {
    id: 8,
    eventName: "Jakarta Warehouse Project 2025", // // event_id: 35
    userName: "Kevin Anggara",
    ticketQuantity: 1,
    totalPricePaid: 75000,
    status: "attending",
  },
  {
    id: 9,
    eventName: "Nusantara Run Surabaya 2025", // // event_id: 38
    userName: "Arifin",
    ticketQuantity: 1,
    totalPricePaid: 50000,
    status: "expired",
  },
  {
    id: 10,
    eventName: "Jakarta Kreatif Fest 2025",// event_id: 34
    userName: "Putri Ananda",
    ticketQuantity: 1,
    totalPricePaid: 0,
    status: "attending",
  },
  {
    id: 11,
    eventName: "Jakarta Fair 2025", // event_id: 33
    userName: "Denny Hakim",
    ticketQuantity: 5,
    totalPricePaid: 200000,
    status: "attended",
  },
  {
    id: 12,
    eventName: "Week Me Up Music Festival 2025", // event_id: 28
    userName: "Tiara Devina",
    ticketQuantity: 2,
    totalPricePaid: 400000,
    status: "cancelled",
  },
  {
    id: 13,
    eventName: "Collab Music Fest 2025", // event_id: 29
    userName: "Fajar Sidik",
    ticketQuantity: 1,
    totalPricePaid: 100000,
    status: "attending",
  },
  {
    id: 14,
    eventName: "Yogya World Heritage Festival 2025", // event_id: 32
    userName: "Nur Aini",
    ticketQuantity: 2,
    totalPricePaid: 0,
    status: "attended",
  },
  {
    id: 15,
    eventName: "Surabaya Music Parade 2025", // event_id: 37
    userName: "Doni Prasetyo",
    ticketQuantity: 3,
    totalPricePaid: 0,
    status: "attending",
  },
  {
    id: 16,
    eventName: "Bandung Soundwave 2025", // event_id: 31
    userName: "Rina Wulandari",
    ticketQuantity: 2,
    totalPricePaid: 310000,
    status: "attending",
  },
  {
    id: 17,
    eventName: "Indomaret Funbike Medan 2025", // event_id: 36
    userName: "Yudha Fikri",
    ticketQuantity: 2,
    totalPricePaid: 100000,
    status: "expired",
  },
  {
    id: 18,
    eventName: "Jakarta Kreatif Fest 2025", // event_id: 34
    userName: "Linda Koesnadi",
    ticketQuantity: 1,
    totalPricePaid: 0,
    status: "cancelled",
  },
  {
    id: 19,
    eventName: "Collab Music Fest 2025", // event_id: 29
    userName: "Andika Pratama",
    ticketQuantity: 1,
    totalPricePaid: 100000,
    status: "attended",
  },
  {
    id: 20,
    eventName: "Festival Kuliner Bandung 2025", // event_id: 30
    userName: "Selvi Mayasari",
    ticketQuantity: 3,
    totalPricePaid: 0,
    status: "attending",
  },
];
