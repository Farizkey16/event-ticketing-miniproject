export default function EventSearch() {
  return (
    <div className="bg-white rounded-md shadow flex items-center p-2 w-full max-w-2xl">
      <input
        type="text"
        placeholder="Enter Location"
        className="w-1/2 p-2 border-r border-gray-300 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Search Event"
        className="w-1/2 p-2 focus:outline-none"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">
        Find Events
      </button>
    </div>
  );
}
