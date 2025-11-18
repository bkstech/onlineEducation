"use client";

import { useState } from "react";

const countriesRaw = [
  { name: "India (Bharat)", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+1" },
  // Add more countries as needed
];

const countries = [...countriesRaw.filter((c) => c.name === "India (Bharat)")];

export default function RegisterTeacher() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(countries[0]?.name || "");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [specialize, setSpecialize] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find(
      (c): c is { name: string; code: string } =>
        !!c && c.name === e.target.value
    );
    setCountry(selected ? selected.name : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // TODO: Add registration logic
    setTimeout(() => {
      setLoading(false);
      setError("Demo only: Registration logic not implemented.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Register as Teacher
        </h1>
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
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
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
              autoComplete="new-password"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={country}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-slate-700"
            >
              Years of Experience
            </label>
            <input
              id="experience"
              name="experience"
              type="number"
              min="0"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="specialize"
              className="block text-sm font-medium text-slate-700"
            >
              Specialize In
            </label>
            <input
              id="specialize"
              name="specialize"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={specialize}
              onChange={(e) => setSpecialize(e.target.value)}
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
