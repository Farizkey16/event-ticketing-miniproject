"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type AuthDropdownProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
};

export default function AuthDropdown({ onSignInClick, onSignUpClick }: AuthDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-white border px-4 py-2 rounded shadow cursor-pointer hover:bg-gray-100">
          Greetings! <span className="text-blue-500">Sign in</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white border shadow rounded p-2 w-48 z-50">
        <DropdownMenuItem
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
          onSelect={onSignInClick}
        >
          Sign in
        </DropdownMenuItem>

        <DropdownMenuItem
          className="px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
          onSelect={onSignUpClick}
        >
          New here? <span className="text-blue-500 ml-1">Sign up</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
