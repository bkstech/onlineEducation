"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";

const countriesRaw = [
  { name: "India (Bharat)", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+1" },
  // Add more countries as needed
];

const countries = [
  countriesRaw.find((c) => c.name === "India (Bharat)"),
  ...countriesRaw
    .filter((c) => c.name !== "India (Bharat)")
    .sort((a, b) => a.name.localeCompare(b.name)),
].filter(Boolean);

export default function RegisterStudent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    country: countries[0]?.name || "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find(
      (c): c is { name: string; code: string } =>
        !!c && c.name === e.target.value
    );
    setFormData({ ...formData, country: selected ? selected.name : "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create registration request with required fields
      // Using default values for fields not collected by the form
      await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        country: formData.country,
        // Default values for required fields not in the form
        address: "Not provided",
        city: "Not provided",
        state: "Not provided",
        zip: "00000",
        dob: new Date("2000-01-01").toISOString(),
      });
      
      // Redirect to home page on successful registration
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Register as Student
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-slate-700"
            >
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
          </div>
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
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              autoComplete="new-password"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-slate-700"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={formData.country}
              onChange={handleCountryChange}
            >
              {countries.map((c) =>
                c ? (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ) : null
              )}
            </select>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
