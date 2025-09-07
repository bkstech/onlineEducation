
import Link from "next/link";

const Counselling = () => (
  <>
    <div className="w-full flex justify-start mt-2 mb-4 px-4">
      <Link
        href="/"
        className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow"
      >
        &larr; Back to Home
      </Link>
    </div>
    <main>
      <section className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-3xl font-bold text-slate-900">
            Child/Parent Counselling
          </h1>
          <p className="mt-3 text-slate-600 max-w-3xl">
            Compassionate support for children and families using evidence-based
            counselling techniques tailored to your needs.
          </p>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Child Counselling</h3>
            <p className="mt-2 text-slate-600">
              Helping children navigate emotions, behavior, and social skills in
              a safe environment.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Parent Coaching</h3>
            <p className="mt-2 text-slate-600">
              Practical strategies to support positive routines and
              communication at home.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Workshops</h3>
            <p className="mt-2 text-slate-600">
              Interactive sessions on parenting, study habits, and wellbeing.
            </p>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default Counselling;
