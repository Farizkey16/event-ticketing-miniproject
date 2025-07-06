
interface HelpCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function HelpCard({ icon, title, description }: HelpCardProps) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
      <div className="text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
