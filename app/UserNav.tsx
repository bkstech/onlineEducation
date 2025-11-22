"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function UserNav() {
  const { state, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (state.user) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          className="nav-link font-semibold text-indigo-700 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          {state.user.firstname} {state.user.lastname}
        </button>
        {open && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50"
          >
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
