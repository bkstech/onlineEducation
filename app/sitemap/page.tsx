import Link from "next/link";

const Sitemap = () => (
  <>
    <div className="w-full flex justify-start mt-2 mb-4 px-4">
      <Link
        href="/"
        className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow"
      >
        &larr; Back to Home
      </Link>
    </div>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold">Sitemap</h1>
      <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 list-disc pl-6">
        <li>
          <Link className="text-indigo-600 hover:underline" href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className="text-indigo-600 hover:underline"
            href="/school-education"
          >
            School Education
          </Link>
        </li>
        <li>
          <Link className="text-indigo-600 hover:underline" href="/counselling">
            Child/Parent Counselling
          </Link>
        </li>
        <li>
          <Link className="text-indigo-600 hover:underline" href="/languages">
            Languages
          </Link>
        </li>
        <li>
          <Link className="text-indigo-600 hover:underline" href="/about">
            About Us
          </Link>
        </li>
        <li>
          <Link className="text-indigo-600 hover:underline" href="/contact">
            Contact Us
          </Link>
        </li>
        <li>
          <Link className="text-indigo-600 hover:underline" href="/terms">
            Terms &amp; Conditions
          </Link>
        </li>
      </ul>
      <p className="mt-10">
        <Link className="text-indigo-600 hover:underline" href="/">
          &larr; Back to Home
        </Link>
      </p>
    </main>
  </>
);

export default Sitemap;
