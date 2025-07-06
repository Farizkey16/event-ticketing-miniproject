import HelpCard from "@/components/helpcard";
import HelpSearch from "@/components/helpsearch";

const helpItems = [
  { title: "Event Organiser", description: "Learn to create and manage events", icon: "📅" },
  { title: "Consumer", description: "Guides for attendees and purchases", icon: "🛍️" },
  { title: "FAQs", description: "Frequently asked questions", icon: "❓" },
  { title: "Ask a Question", description: "Reach out for support", icon: "💬" },
  { title: "Book a Consultation", description: "One-on-one assistance", icon: "📞" },
  { title: "Request a Feature", description: "Share your improvement ideas", icon: "💡" },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Hey there, how can we help?</h1>
        <HelpSearch />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {helpItems.map((item) => (
            <HelpCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
