import React from "react";

const Languages = () => (
  <>
    <div className="w-full flex justify-start mt-2 mb-4 px-4">
      <a
        href="/"
        className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow"
      >
        &larr; Back to Home
      </a>
    </div>
    <main>
      <section className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-3xl font-bold text-slate-900">Languages</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">
            Build confidence and fluency with interactive language lessons and
            supportive instructors.
          </p>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">English</h3>
            <p className="mt-2 text-slate-600">
              Spoken English, grammar, and academic writing support for all
              levels.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Regional &amp; Foreign</h3>
            <p className="mt-2 text-slate-600">
              Options for Hindi, German, French, Spanish, and more based on
              demand.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Exam Prep</h3>
            <p className="mt-2 text-slate-600">
              IELTS, TOEFL, and school board language exams with practice tests.
            </p>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default Languages;
