"use client";

import Link from "next/link";
import { FaShieldAlt, FaEnvelope, FaMoneyBillAlt, FaCheckCircle, FaVideo, FaHandshake, FaLock, FaStar } from "react-icons/fa";
import FeatureCard from "@/components/featurecard";

export default function FeaturesPage() {
  const features = [
    {
      icon: <FaMoneyBillAlt />,
      title: "The most affordable ticket fees",
      description: "With just a 2% fee and 30 cents per ticket, LocalEvent offers the most budget-friendly option for event organizers.",
    },
    {
      icon: <FaHandshake />,
      title: "Dedicated customer support",
      description: "Our support team is always available to assist with event setup, payment issues, and technical problems.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Intuitive platform",
      description: "Easily create and manage events with a clean, user-friendly interface designed for simplicity.",
    },
    {
      icon: <FaEnvelope />,
      title: "Embedded email marketing",
      description: "Send promotional emails directly from the platform—no need for third-party tools.",
    },
    {
      icon: <FaVideo />,
      title: "Built-in video conferencing",
      description: "Host online events seamlessly with built-in video conferencing tools—no additional software required.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure and safe payments",
      description: "Your transactions are secure with our PCI-compliant payment gateway integration.",
    },
    {
      icon: <FaLock />,
      title: "Privacy guaranteed",
      description: "Your data will never be shared with third-party advertisers or agencies. We respect your privacy.",
    },
    {
      icon: <FaStar />,
      title: "Powerful yet user-friendly features",
      description: "From ticket promotions and team collaboration to analytics and scanning—everything you need without complexity.",
    },
  ];

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        10 Advantages of Using LocalEvent
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/organizer/signup">
          <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
            Create Event
          </button>
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          Create your first event in minutes
        </p>
      </div>
    </main>
  );
}
