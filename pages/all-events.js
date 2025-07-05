import { useEffect, useState } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Menu } from "lucide-react";

export default function AllEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("hosted");
  const [search, setSearch] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [today, setToday] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    fetch("/api/eventsAll")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.data);
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (!today) return null;

  const hostedEvents = events.filter((event) => new Date(event.date) < today);
  const upcomingEvents = events.filter((event) => new Date(event.date) >= today);

  const filteredEvents =
    (activeTab === "hosted" ? hostedEvents : upcomingEvents).filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <Head>
        <title>All Hallows Seminary, Onitsha</title>
        <meta name="description" content="Welcome to All Hallows Seminary, Onitsha" />
      </Head>

      <div className="flex bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white min-h-screen w-full overflow-x-hidden">
        {/* Sidebar (desktop) */}
        <div className="lg:w-64 hidden lg:block border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111]">
          <Sidebar />
        </div>

        {/* Sidebar toggle button (mobile) */}
        <div className="lg:hidden absolute top-4 left-4 z-50">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="text-[#240046] dark:text-white p-2 bg-white dark:bg-[#222] rounded-md shadow-md"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar overlay (mobile) */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          >
            <div
              className="w-64 bg-white dark:bg-[#111] h-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col w-full">
          <main className="flex-grow px-4 md:px-6 py-6 w-full">
            <Header />

            <section>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 w-full">
                <h2 className="text-2xl font-bold text-[#240046] dark:text-white mb-4 md:mb-0">
                  Events
                </h2>

                <div className="flex space-x-4 border-b dark:border-gray-700 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab("hosted")}
                    className={`pb-2 text-base transition duration-200 ${
                      activeTab === "hosted"
                        ? "border-b-2 border-[#240046] dark:border-white font-semibold text-[#240046] dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-[#240046] dark:hover:text-white"
                    }`}
                  >
                    Hosted Events
                  </button>
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`pb-2 text-base transition duration-200 ${
                      activeTab === "upcoming"
                        ? "border-b-2 border-[#240046] dark:border-white font-semibold text-[#240046] dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-[#240046] dark:hover:text-white"
                    }`}
                  >
                    Upcoming Events
                  </button>
                </div>
              </div>

              <div className="mb-6 w-full">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#240046] bg-white dark:bg-[#1a1a1a] text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64 w-full">
                  <svg
                    className="animate-spin h-8 w-8 text-[#240046] dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : error ? (
                <p className="text-red-500 text-center">Error fetching events.</p>
              ) : filteredEvents.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No events found.
                </p>
              ) : (
                <AnimatePresence>
                  <motion.div
                    key={activeTab + search}
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

            <section className="my-12 border-t pt-8 border-gray-200 dark:border-gray-700 w-full">
              <h2 className="text-2xl font-bold text-center mb-4 text-[#240046] dark:text-white">
                📅 Academic Calendar (Synced with Google)
              </h2>
              <p className="text-center text-sm mb-6 text-gray-600 dark:text-gray-400">
                View upcoming seminary events and set reminders via Google Calendar.
              </p>

              <div className="w-full overflow-hidden">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=u6520283%40au.edu&ctz=Asia%2FBangkok"
                  style={{ border: 0 }}
                  className="w-full h-[400px] sm:h-[600px] max-w-full"
                  frameBorder="0"
                  scrolling="no"
                  title="Academic Calendar"
                ></iframe>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
