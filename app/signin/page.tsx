"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "@/lib/auth";
import { useAuth } from "@/app/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let localRole = role;
      if (typeof window !== "undefined") {
        const userRole = localStorage.getItem("role");
        if (userRole === "student" || userRole === "teacher") {
          localRole = userRole;
        }
      }
      const data = await apiLogin({ email, password, role: localRole });
      login({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        id: data.id,
      });
      // Redirect to home page on successful login
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Add your Google sign-in logic here
    setError("Demo only: Google sign-in not implemented.");
  };

  const [role, setRole] = useState<"student" | "teacher">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("role") === "teacher") return "teacher";
    }
    return "student";
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign-in</h1>
        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded border font-semibold ${role === "student" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700 border-indigo-600"}`}
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
            className={`px-4 py-2 rounded border font-semibold ${role === "teacher" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700 border-indigo-600"}`}
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
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-slate-300 rounded-md py-2 mb-4 bg-white hover:bg-slate-100 shadow-sm"
          style={{ fontWeight: 500 }}
        >
          <img
            src="/img/google-icon.svg"
            alt="Google"
            style={{ width: 20, height: 20 }}
          />
          Sign in with Google
        </button>
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-md border-slate-300 bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-indigo-700 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-slate-600">
          Not a member yet? Register now as{" "}
          <Link
            href="/register-student"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Student
          </Link>{" "}
          or as{" "}
          <Link
            href="/register-teacher"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Teacher
          </Link>
        </div>
      </div>
    </div>
  );
}
