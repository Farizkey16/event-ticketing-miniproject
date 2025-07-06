"use client";

import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

const platforms = [
  { id: "youtube", name: "YouTube", icon: <FaYoutube className="text-red-600" /> },
  { id: "instagram", name: "Instagram", icon: <FaInstagram className="text-pink-500" /> },
  { id: "tiktok", name: "TikTok", icon: <FaTiktok className="text-black" /> },
];

export default function PlatformDropdown() {
  const [selected, setSelected] = useState(platforms[0]);

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Platform *</label>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="w-full border rounded px-3 py-2 flex items-center gap-2">
            {selected.icon}
            {selected.name}
          </Listbox.Button>
          <Listbox.Options className="absolute w-full mt-1 border rounded bg-white shadow z-10">
            {platforms.map((platform) => (
              <Listbox.Option
                key={platform.id}
                value={platform}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                {platform.icon}
                {platform.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
