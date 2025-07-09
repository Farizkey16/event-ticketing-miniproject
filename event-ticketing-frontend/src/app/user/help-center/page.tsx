"use client";

export default function HelpCenterBuyer() {
  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Help Center - Buyers</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">🔹 How to Buy a Ticket?</h2>
            <p className="text-gray-700 mt-1">
              Navigate to the event page, select the ticket type, and click "Buy Now". Complete the payment process to secure your spot.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">🔹 Where is My Ticket?</h2>
            <p className="text-gray-700 mt-1">
              After payment, tickets are sent to your registered email and can be accessed anytime in your dashboard under “My Tickets”.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">🔹 Can I Get a Refund?</h2>
            <p className="text-gray-700 mt-1">
              Refund policies depend on the event organizer. Please check the event's refund terms or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
