"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kirim data ke backend/API kamu di sini
    console.log("Form submitted:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-md shadow-md overflow-hidden md:flex">
        {/* Info Kiri */}
        <div className="bg-gradient-to-br from-green-100 to-blue-100 md:w-1/3 p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="text-sm mb-4">Fill out the form and our team will get back to you soon.</p>
          <p className="mb-2">📞087876785670 </p>
          <p className="mb-2">📧 contact@localevent.com</p>
          <p>🔗 <a href="/help-center" className="text-blue-600 underline">Help Center</a></p>
        </div>

        {/* Form Kanan */}
        <form onSubmit={handleSubmit} className="md:w-2/3 p-6 space-y-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="text-sm text-gray-600">Have any questions? We'd love to hear from you.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="firstName" required onChange={handleChange} placeholder="First Name*" className="border p-2 rounded" />
            <input name="lastName" required onChange={handleChange} placeholder="Last Name*" className="border p-2 rounded" />
            <input name="email" type="email" required onChange={handleChange} placeholder="Email*" className="border p-2 rounded" />
            <input name="phone" required onChange={handleChange} placeholder="Phone*" className="border p-2 rounded" />
            <input name="company" onChange={handleChange} placeholder="Company" className="col-span-2 border p-2 rounded" />
            <input name="subject" onChange={handleChange} placeholder="Subject*" className="col-span-2 border p-2 rounded" />
            <textarea name="message" required onChange={handleChange} placeholder="Message*" rows={5} className="col-span-2 border p-2 rounded" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Submit</button>
        </form>
      </div>
    </div>
  );
}
