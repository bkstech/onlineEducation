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
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find(
      (c): c is { name: string; code: string } =>
        !!c && c.name === e.target.value
    );
    setCountry(selected ? selected.name : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/teacher/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            country,
            phone,
            experience: Number(experience),
            specializein: specialize,
            zip,
            city,
            state,
            address,
            lastname: lastName,
            firstname: firstName,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || "Registration failed");
      }
      setError("");
      // Redirect to /signin with Teacher selected
      window.location.href = "/signin?role=teacher";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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
              htmlFor="firstName"
              className="block text-sm font-medium text-slate-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              htmlFor="address"
              className="block text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-slate-700"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-slate-700"
            >
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-slate-700"
            >
              Zip Code / Pin Code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              required
              className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
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
