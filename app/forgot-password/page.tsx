"use client";

import { API_BASE_URL } from "@/lib/auth";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("role") === "teacher") return "teacher";
    }
    return "student";
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    (async () => {
      try {
        // generate a simple token (UUID) to include in the reset link
        // Call backend forgot endpoint which will generate token and send email
        const res = await fetch(`${API_BASE_URL}/api/Auth/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, role }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || "Failed to request password reset");
        }

        setMessage(
          "If this email is registered, a password reset link has been sent."
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while sending reset email.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded border font-semibold ${
              role === "student"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 border-indigo-600"
            }`}
            onClick={() => {
              setRole("student");
              if (typeof window !== "undefined") {
                localStorage.setItem("role", "student");
              }
            }}
          >
            Student
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded border font-semibold ${
              role === "teacher"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 border-indigo-600"
            }`}
            onClick={() => {
              setRole("teacher");
              if (typeof window !== "undefined") {
                localStorage.setItem("role", "teacher");
              }
            }}
          >
            Teacher
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-md border-slate-300 bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-600 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
