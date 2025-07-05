import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = useRef(null);

  const [currentEvent, setCurrentEvent] = useState({
    _id: "",
    name: "",
    description: "",
    date: "",
    time: "",
    category: "",
    imageURL: "",
  });

  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/eventsAll");
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data || defaultCategories);
    } catch {
      setCategories(defaultCategories);
    }
  };

  const defaultCategories = [
    { id: "1", name: "Seminar" },
    { id: "2", name: "Workshop" },
    { id: "3", name: "Social" },
    { id: "4", name: "Religious" },
    { id: "5", name: "Academic" },
  ];

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEvent({
      _id: "",
      name: "",
      description: "",
      date: "",
      time: "",
      category: "",
      imageURL: "",
    });
    setAdminPasscode("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setCurrentEvent({
      ...event,
      date: event.date ? new Date(event.date).toISOString().slice(0, 10) : "",
    });
    setAdminPasscode("");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!loading) setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentEvent((prev) => ({ ...prev, imageURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelect = (catName) => {
    setCurrentEvent((prev) => ({ ...prev, category: catName }));
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/admin/events/${id}`);
      await fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (adminPasscode !== "adminispowerful") {
      setError("Invalid admin passcode.");
      return;
    }

    if (!currentEvent.name.trim() || !currentEvent.date) {
      setError("Event name and date are required.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(`/api/admin/events/${currentEvent._id}`, currentEvent);
      } else {
        await axios.post("/api/admin/events", currentEvent);
      }
      await fetchEvents();
      closeModal();
    } catch (err) {
      console.error("Error saving event:", err);
      setError("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-[#0d0d0d] text-black dark:text-white transition-colors m-0 overflow-hidden">
      <Header />

      <main className="flex-grow w-full p-0 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 w-full">
          <h2 className="text-4xl font-extrabold">Admin Dashboard</h2>
          <div className="flex gap-3">
            <button
              onClick={openCreateModal}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition"
            >
              + Add Event
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded shadow transition"
            >
              Exit
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {events.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-400 italic">
              No events found.
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="relative bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-5 hover:shadow-lg transition w-full"
              >
                <EventCard event={event} />
                <div className="absolute top-3 right-3 flex space-x-3">
                  <button
                    onClick={() => openEditModal(event)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Event"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Event"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1c1c1c] rounded-lg shadow-xl w-full max-w-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Edit Event" : "Create a New Event"}
              </h2>
              {error && (
                <p className="mb-4 text-red-600 border border-red-300 rounded px-3 py-2 bg-red-50 dark:bg-red-900 dark:text-white">
                  {error}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  placeholder="Event Title"
                  value={currentEvent.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-white dark:bg-[#2a2a2a] dark:text-white"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={currentEvent.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border rounded bg-white dark:bg-[#2a2a2a] dark:text-white"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="date"
                    name="date"
                    value={currentEvent.date}
                    onChange={handleChange}
                    className="w-full p-3 border rounded bg-white dark:bg-[#2a2a2a] dark:text-white"
                    required
                  />
                  <input
                    type="time"
                    name="time"
                    value={currentEvent.time}
                    onChange={handleChange}
                    className="w-full p-3 border rounded bg-white dark:bg-[#2a2a2a] dark:text-white"
                    required
                  />
                </div>
                <input
                  type="password"
                  placeholder="Admin Passcode"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full p-3 border rounded bg-white dark:bg-[#2a2a2a] dark:text-white"
                  required
                />

                <div>
                  <label className="block mb-1 font-semibold">Attach Image or Paste Video URL</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowUploadOptions(!showUploadOptions)}
                      className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white text-2xl"
                    >
                      +
                    </button>
                    {currentEvent.imageURL && (
                      <img
                        src={currentEvent.imageURL}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                  {showUploadOptions && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-blue-600 hover:underline"
                      >
                        Upload Image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                      <input
                        type="text"
                        name="imageURL"
                        placeholder="Or paste URL"
                        value={currentEvent.imageURL}
                        onChange={handleChange}
                        className="mt-2 w-full p-3 border rounded bg-white dark:bg-[#2a2a2a] dark:text-white"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-semibold">Select Category</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`px-3 py-1 rounded-full ${
                          currentEvent.category === cat.name
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 rounded border text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
