"use client";

import { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import Link from "next/link";

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const Contact = () => {
  const [num1, setNum1] = useState<number | null>(null);
  const [num2, setNum2] = useState<number | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setNum1(getRandomInt(1, 10));
    setNum2(getRandomInt(1, 10));
  }, []);
  const refreshCaptcha = () => {
    setNum1(getRandomInt(1, 10));
    setNum2(getRandomInt(1, 10));
    setCaptchaInput("");
    setError("");
  };
  const answer = (num1 ?? 0) + (num2 ?? 0);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMsg("");
    setError("");
    if (parseInt(captchaInput) !== (num1 ?? 0) + (num2 ?? 0)) {
      setError("Incorrect captcha answer. Please try again.");
      return;
    }
    setSending(true);
    try {
      // Replace these with your actual EmailJS values
      const SERVICE_ID = "service_9c8y97t";
      const TEMPLATE_ID = "template_lkaq14w";
      const USER_ID = "NJc1OMSP_Ebn46er9";
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current!,
        USER_ID
      );
      setFormMsg("Thank you! Your message has been sent.");
      if (formRef.current) formRef.current.reset();
      setCaptchaInput("");
      refreshCaptcha();
    } catch (err) {
      setFormMsg(
        "Sorry, there was an error sending your message. Please try again later."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="w-full flex items-center mt-2 mb-4 px-4">
        <Link
          href="/"
          className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow"
        >
          &larr; Back to Home
        </Link>
      </div>
      <main>
        <h1 className="text-2xl font-bold text-center mb-6">
          Submit your request
        </h1>

        <section
          className="bg-white flex items-center justify-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
            <form ref={formRef} onSubmit={handleSubmit}>
              <div>
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="full_name"
                >
                  Your Full name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border-slate-300 bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Madhuri Goel"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-md border-slate-300 bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="madhuri@example.com"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700"
                    htmlFor="phone"
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 w-full rounded-md border-slate-300 bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="+91 9101 101 101"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="description"
                >
                  What service are you interested in?
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="mt-1 w-full rounded-md border-slate-300 bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Tell us about your needs..."
                ></textarea>
              </div>
              {/* Dynamic Math Captcha */}
              <div className="mt-4">
                <label
                  className="block text-sm font-medium text-slate-700"
                  htmlFor="captcha"
                >
                  Captcha: What is{" "}
                  {num1 !== null && num2 !== null ? `${num1} + ${num2}` : "..."}
                  ? (Anti-spam)
                  <button
                    type="button"
                    aria-label="Refresh captcha"
                    onClick={refreshCaptcha}
                    className="ml-2 text-indigo-600 hover:text-indigo-900"
                    style={{ fontSize: "1.2em", verticalAlign: "middle" }}
                  >
                    &#x21bb;
                  </button>
                </label>
                <input
                  id="captcha"
                  name="captcha"
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="mt-1 w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Your answer"
                  autoComplete="off"
                  disabled={num1 === null || num2 === null}
                />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
              </div>
              <div className="flex items-center justify-between mt-6">
                <p id="formMsg" className="text-sm">
                  {formMsg && (
                    <span
                      className={
                        formMsg.startsWith("Thank you")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formMsg}
                    </span>
                  )}
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
                  disabled={sending}
                >
                  <i className="fa-regular fa-paper-plane mr-2"></i>{" "}
                  {sending ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
