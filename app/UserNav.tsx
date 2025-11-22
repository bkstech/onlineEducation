"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function UserNav() {
  const { state, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (state.user) {
    return (
      <div className="relative">
        <button
          className="nav-link font-semibold text-indigo-700 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          {state.user.firstname} {state.user.lastname}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
            <button
              className="block w-full text-left px-4 py-2 text-red-700 hover:bg-red-100"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/signin" className="nav-link hover:text-indigo-700">
      Sign-in
    </Link>
  );
}
