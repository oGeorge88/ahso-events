import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../contexts/AppContext";
import { Menu } from "lucide-react";

// Fetch Seminary News
export async function getStaticProps() {
  try {
    const res = await fetch("https://allhallowsseminary.com/category/events/");
    const html = await res.text();
    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);

    const news = [];
    $(".category-events .entry-title").each((i, el) => {
      if (i >= 3) return;
      const title = $(el).text().trim();
      const url = $(el).find("a").attr("href");
      const date = $(el).closest("article").find(".entry-date").text().trim();
      news.push({ title, url, date });
    });

    return { props: { news } };
  } catch (error) {
    console.error("Failed to scrape news:", error);
    return { props: { news: [] } }; // fallback
  }
}

export default function Home({ news = [] }) {
  const { darkMode } = useAppContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  const { type } = router.query;

  const eventTypeMap = {
    past: "eventsPast",
    all: "eventsAll",
    upcoming: "eventsUpcoming",
  };

  const eventLabelMap = {
    past: "Past Events",
    all: "All Events",
    upcoming: "Upcoming Events",
  };

  const eventType = eventTypeMap[type] || eventTypeMap.upcoming;
  const eventLabel = eventLabelMap[type] || eventLabelMap.upcoming;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/${eventType}`);
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
          setError(false);
        } else {
          throw new Error("Error fetching events.");
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventType]);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>{`All Hallows Seminary, Onitsha | ${eventLabel}`}</title>
        <meta
          name="description"
          content={`Browse ${eventLabel.toLowerCase()} at All Hallows Seminary (AHSO), Onitsha.`}
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white w-full">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-[#00083B] dark:text-white text-3xl"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-[#111] border-r shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="lg:w-64 hidden lg:block border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] h-full">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-h-screen w-full overflow-x-hidden">
          <main className="flex-1 px-4 py-6 lg:px-6 w-full">
            <Header />

            {/* Search + Events */}
            <section>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#00083B] dark:text-white">
                  {eventLabel}
                </h2>

                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-4 md:mt-0 w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-[#1a1a1a] text-black dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:border-[#00083B] dark:focus:border-blue-400"
                />
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="loader text-center">Loading...</div>
                </div>
              ) : error ? (
                <p className="text-red-500 text-center">Error fetching events.</p>
              ) : filteredEvents.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No events found.</p>
              ) : (
                <AnimatePresence>
                  <motion.div
                    key={search}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 w-full"
                  >
                    {filteredEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>

            {/* Google Calendar */}
            <section className="my-12 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-center mb-4 text-[#00083B] dark:text-white">
                📅 Academic Calendar (Synced with Google)
              </h2>
              <p className="text-center text-sm mb-6 text-gray-600 dark:text-gray-400">
                View upcoming seminary events and set reminders via Google Calendar.
              </p>
              <div className="overflow-x-auto w-full">
                <div className="w-full max-w-full mx-auto">
                  <iframe
                    src="https://calendar.google.com/calendar/embed?src=u6520283%40au.edu&ctz=Asia%2FBangkok"
                    style={{ border: 0 }}
                    className="w-full h-[400px] sm:h-[600px]"
                    frameBorder="0"
                    scrolling="no"
                    title="Academic Calendar"
                  ></iframe>
                </div>
              </div>
            </section>

            {/* Seminary News */}
            <section className="my-12 px-4 lg:px-12">
              <h2 className="text-2xl font-bold text-center text-[#00083B] dark:text-white mb-4">
                📰 Latest from All Hallows Seminary
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-full">
                {news.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border rounded-lg p-5 hover:shadow-xl transition bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="font-semibold text-[#00083B] dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                  </a>
                ))}
              </div>
              <div className="text-center mt-6">
                <a
                  href="https://allhallowsseminary.com/category/events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-[#00083B] dark:bg-blue-700 text-white rounded shadow hover:bg-[#001163] dark:hover:bg-blue-800"
                >
                  View All News
                </a>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
