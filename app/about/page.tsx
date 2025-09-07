import Link from "next/link";

const About = () => (
  <div>
    <div className="w-full flex justify-start mt-2 mb-4 px-4">
      <Link
        href="/"
        className="text-indigo-700 font-semibold hover:underline bg-white/80 px-3 py-1 rounded shadow"
      >
        &larr; Back to Home
      </Link>
    </div>
    {/* Header and navigation would be in layout. Main content below: */}
    <main>
      <section className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">
            We are dedicated to empowering learners and families through online
            education and compassionate counselling. Our team combines
            pedagogical expertise with practical strategies to help students
            thrive.
          </p>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold">
              Benefits of Online Education
            </h2>
            <ul className="mt-4 space-y-2 text-slate-700 list-disc pl-5">
              <li>Flexibility to learn anywhere, anytime without commuting.</li>
              <li>
                Personalized pacing with recorded materials and live sessions.
              </li>
              <li>
                Access to a wider range of specialists and language tutors.
              </li>
              <li>Safe, supportive, and distraction-minimized environment.</li>
              <li>
                Better progress tracking with digital tools and analytics.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              Our Strength in Online Education &amp; Counselling
            </h2>
            <ul className="mt-4 space-y-2 text-slate-700 list-disc pl-5">
              <li>
                Experienced educators and certified counsellors focused on child
                and family wellbeing.
              </li>
              <li>
                Structured curricula aligned with learning outcomes and exam
                boards.
              </li>
              <li>
                Evidence-based counselling methods tailored to each family’s
                needs.
              </li>
              <li>
                Interactive virtual classrooms using proven engagement
                techniques.
              </li>
              <li>Transparent communication and regular feedback cycles.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default About;
