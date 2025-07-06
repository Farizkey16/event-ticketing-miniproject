"use client";

import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export default function EventTypeSelector() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (path: string) => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-1">Select the event type *</label>
      <div className="flex gap-3">
        <button
          className={clsx(
            "px-4 py-2 border rounded",
            pathname === "/organizer/create-event" ? "bg-blue-600 text-white" : ""
          )}
          onClick={() => handleSelect("/organizer/create-event")}
        >
          Venue Event
        </button>
        <button
          className={clsx(
            "px-4 py-2 border rounded",
            pathname === "/organizer/create-online-event" ? "bg-blue-600 text-white" : ""
          )}
          onClick={() => handleSelect("/organizer/create-online-event")}
        >
          Online Event
        </button>
        <button
          className={clsx(
            "px-4 py-2 border rounded",
            pathname === "/organizer/undecided-event" ? "bg-blue-600 text-white" : ""
          )}
          onClick={() => handleSelect("/organizer/undecided-event")}
        >
          Undecided
        </button>
      </div>
    </div>
  );
}
