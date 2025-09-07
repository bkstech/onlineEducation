export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Empowering Students and Families with Expert Guidance
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                From personalized school education support to child/parent
                counselling and language learning, we deliver trusted online
                services designed around you.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700"
                >
                  Learn More
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border px-5 py-3 border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-50"
                >
                  Get in Touch
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <figure className="overflow-hidden rounded-lg shadow">
                <img
                  src="/img/studentteacher.jpeg"
                  alt="Woman teacher with a 12 year old student"
                  className="h-full w-full object-cover"
                />
                <figcaption className="p-3 text-sm text-slate-600 bg-white">
                  One-to-one online tutoring
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-lg shadow">
                <img
                  src="/img/parentdropkidstoschool.jpeg"
                  alt="Parents dropping kid to school"
                  className="h-full w-full object-cover"
                />
                <figcaption className="p-3 text-sm text-slate-600 bg-white">
                  Support for families and learners
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="bg-slate-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h2 className="text-2xl font-bold text-slate-900">Our Services</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/school-education"
              className="group rounded-lg border bg-white p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">School Education</h3>
                <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-indigo-600"></i>
              </div>
              <p className="mt-2 text-slate-600">
                Personalized academic support, homework help, and exam
                preparation.
              </p>
            </a>
            <a
              href="/counselling"
              className="group rounded-lg border bg-white p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Child/Parent Counselling
                </h3>
                <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-indigo-600"></i>
              </div>
              <p className="mt-2 text-slate-600">
                Evidence-based guidance for emotional wellbeing and family
                dynamics.
              </p>
            </a>
            <a
              href="/languages"
              className="group rounded-lg border bg-white p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Languages</h3>
                <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-indigo-600"></i>
              </div>
              <p className="mt-2 text-slate-600">
                Interactive language lessons to build confidence and fluency.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
