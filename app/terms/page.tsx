import React from "react";
import Link from "next/link";

const Terms = () => (
  <>
    <div className="w-full flex justify-start mt-2 mb-4 px-4">
      <Link href="/" className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow">
        &larr; Back to Home
      </Link>
    </div>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>
      <p className="mt-4 text-slate-700">
        These terms and conditions outline the rules and regulations for the use
        of EduCounsel&apos;s website and services.
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. Services</h2>
      <p className="mt-2 text-slate-700">
        We provide online education support, counselling, and language learning
        services. Details may change without prior notice.
      </p>
      <h2 className="mt-6 text-xl font-semibold">2. Use of Website</h2>
      <p className="mt-2 text-slate-700">
        By accessing this website, you accept these terms. Do not continue to
        use the site if you do not agree with all of the terms and conditions
        stated on this page.
      </p>
      <h2 className="mt-6 text-xl font-semibold">3. Privacy</h2>
      <p className="mt-2 text-slate-700">
        Contact form submissions are stored to process your request. We will not
        sell your personal information to third parties.
      </p>
      <h2 className="mt-6 text-xl font-semibold">4. Liability</h2>
      <p className="mt-2 text-slate-700">
        Services are provided &quot;as is&quot;. We are not liable for any indirect or
        consequential loss.
      </p>
      <h2 className="mt-6 text-xl font-semibold">5. Contact</h2>
      <p className="mt-2 text-slate-700">
        For any questions regarding these terms, please contact us via the
        Contact Us page.
      </p>
      <p className="mt-10 text-sm text-slate-500">
        Last updated: {new Date().getFullYear()}
      </p>
      <p className="mt-10">
        <Link className="text-indigo-600 hover:underline" href="/">
          &larr; Back to Home
        </Link>
      </p>
    </main>
  </>
);

export default Terms;
