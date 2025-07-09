"use client";

export default function PaymentMethodPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 z-50">
      <h2 className="text-xl font-semibold mb-4">Tambah Rekening Bank</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Bank Name</label>
          <input type="text" className="w-full border rounded p-2" placeholder="BCA, Mandiri, dll" />
        </div>
        <div>
          <label className="block text-sm font-medium">Account Number</label>
          <input type="text" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Account Holder Number</label>
          <input type="text" className="w-full border rounded p-2" />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-gray-500 hover:underline"
        >
          Batal
        </button>
      </form>
    </div>
  );
}
