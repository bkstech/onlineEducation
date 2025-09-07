import Link from "next/link";

const SchoolEducation = () => (
  <>
    <div className="w-full flex justify-start mt-2 mb-4 px-4">
      <Link
        href="/"
        className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow"
      >
        &larr; Back to Home
      </Link>
    </div>
import Link from "next/link";
    <main>
      <section className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-3xl font-bold text-slate-900">
            School Education
          </h1>
          <p className="mt-3 text-slate-600 max-w-3xl">
            Personalized academic support for primary and secondary levels,
            including homework help, exam prep, and learning strategies.
          </p>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Homework Support</h3>
            <p className="mt-2 text-slate-600">
              Daily coaching to reinforce classroom learning with guided
              practice.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Exam Preparation</h3>
            <p className="mt-2 text-slate-600">
              Targeted revisions and mock tests for board and competitive exams.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold">Study Skills</h3>
            <p className="mt-2 text-slate-600">
              Time management, note-taking, and memory techniques for success.
            </p>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default SchoolEducation;
