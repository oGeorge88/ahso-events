import Head from "next/head";
import Link from "next/link";

export default function CalendarPage() {
  return (
    <>
      <Head>
        <title>Academic Calendar | All Hallows Seminary, Onitsha</title>
        <meta
          name="description"
          content="View the Academic Calendar for All Hallows Seminary, Onitsha (AHSO)."
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col items-center justify-start py-12 px-4 transition-colors">
        {/* Back button */}
        <div className="self-start mb-6">
          <Link
            href="/home"
            className="inline-block px-4 py-2 text-[#240046] dark:text-white font-semibold border-2 border-[#240046] dark:border-white rounded-lg hover:bg-[#240046] dark:hover:bg-white hover:text-white dark:hover:text-black transition"
            aria-label="Back to Home"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold mb-8 text-[#240046] dark:text-white drop-shadow-md">
          Academic Calendar
        </h1>

        <div className="bg-white dark:bg-[#111] rounded-xl shadow-lg max-w-[1000px] w-full overflow-hidden border-4 border-[#240046] dark:border-white">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=u6520283%40au.edu&ctz=Asia%2FBangkok"
            style={{ border: 0, width: "100%", height: "650px" }}
            frameBorder="0"
            scrolling="no"
            title="AHSO Academic Calendar"
            className="rounded-b-xl"
          />
        </div>

        <p className="mt-6 text-center max-w-md text-[#240046] dark:text-gray-300 font-medium text-lg">
          Stay updated with all academic events and important dates at All Hallows Seminary, Onitsha.
        </p>
      </div>
    </>
  );
}
