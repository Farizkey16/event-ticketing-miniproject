"use client";

const userProfile = {
  name: "harry kurniawan",
  phone: "+6287876785670",
  email: "ada.apanich@gmail.com",
  birthdate: "",
  gender: "",
  country: "Indonesia",
};

export default function UserAccountPage() {
  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Title */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Profil</h1>
        </div>

        {/* Profil Info */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Nama lengkap</span>
            <span className="font-medium">{userProfile.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nomor HP</span>
            <span className="font-medium">{userProfile.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">{userProfile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tanggal lahir</span>
            <span className="text-gray-400 italic">Isi tanggal lahirmu</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jenis kelamin</span>
            <span className="text-gray-400 italic">-</span>
          </div>
        </div>

        {/* Pengaturan */}
        <div className="mb-4 border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Pengaturan</h2>
        </div>

        <div className="space-y-4">
          <button className="w-full flex justify-between items-center p-4 bg-gray-100 rounded hover:bg-gray-200">
            <span>Ganti Kata Sandi</span>
          </button>
          <button className="w-full flex justify-between items-center p-4 bg-gray-100 rounded hover:bg-gray-200">
            <span>Bahasa</span>
            <span className="text-sm text-gray-500">Bahasa Indonesia</span>
          </button>
         
            
        
          
        </div>
      </div>
    </div>
  );
}
