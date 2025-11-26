"use client";

import { useState } from "react";
import { getUserInfo, fetchWithAuth } from "@/lib/auth";

export default function InvitePage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmail = () => {
    const trimmedEmail = currentEmail.trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Check for duplicates
    if (emails.includes(trimmedEmail)) {
      setError("Email already added to the list");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setCurrentEmail("");
    setError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emails.length === 0) {
      setError("Please add at least one email address");
      return;
    }

    const user = getUserInfo();
    if (!user || user.role !== "teacher") {
      setError("You must be logged in as a teacher to invite students");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetchWithAuth("/api/teachercandidates/addcandidateemails", {
        method: "POST",
        body: JSON.stringify({
          teacherId: user.id,
          emails: emails
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send invitations");
      }

      const result = await response.json();
      let successMessage = result.message || "Invitations sent successfully!";
      
      if (result.invalidEmails && result.invalidEmails.length > 0) {
        successMessage += ` Note: ${result.invalidEmails.length} email(s) were skipped due to invalid format.`;
      }
      
      if (result.duplicateEmails && result.duplicateEmails.length > 0) {
        successMessage += ` ${result.duplicateEmails.length} email(s) were skipped because they already exist.`;
      }
      
      setSuccess(successMessage);
      setEmails([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while sending invitations");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Invite Students
        </h1>
        
        <p className="text-slate-600 mb-6">
          Add email addresses of students you want to invite. They will be added to your student list.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Student Email Address
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                className="flex-1 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-100 px-3 py-2"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="student@example.com"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
          </div>

          {emails.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email List ({emails.length})
              </label>
              <div className="border border-slate-300 rounded-md p-4 bg-slate-50 max-h-64 overflow-y-auto">
                <ul className="space-y-2">
                  {emails.map((email, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded shadow-sm"
                    >
                      <span className="text-slate-700">{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || emails.length === 0}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending Invitations..." : `Send Invitations (${emails.length})`}
          </button>
        </form>
      </div>
    </div>
  );
}
