import { useState, useEffect } from "react";
import Image from "next/image";

export default function EventCard({ event }) {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetchingParticipants, setFetchingParticipants] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/addParticipant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, eventId: event._id })
      });
      const data = await res.json();
      if (data.success) {
        alert("Successfully registered!");
        setShowJoinForm(false);
        fetchParticipants();
      } else {
        alert("Failed to register.");
      }
    } catch (error) {
      alert("An error occurred while submitting.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    if (fetchingParticipants) return;
    setFetchingParticipants(true);
    try {
      const res = await fetch(`/api/getParticipants?eventId=${event._id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.participants)) {
        setParticipants(data.participants);
        setShowParticipants(true);
      } else {
        setParticipants([]);
        setShowParticipants(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching participants.");
    } finally {
      setFetchingParticipants(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg duration-300 flex flex-col">
      {/* Event Image */}
      <div className="relative w-full h-48">
        <Image
          src={event.imageURL || "/sample-event.jpg"}
          alt={event.name || "Event image"}
          layout="fill"
          className="object-cover"
        />
      </div>

      {/* Event Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 truncate">{event.name}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{event.description}</p>
        <div className="mt-4 text-sm text-gray-700">
          <span className="font-medium">📅 {new Date(event.date).toLocaleDateString()}</span>
          <br />
          <span className="font-medium">🕒 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setShowJoinForm(true)}
            className="flex-1 px-4 py-2 bg-[#00083B] text-white text-sm rounded hover:bg-[#00083B]/90 transition duration-200"
          >
            Join
          </button>
          <button
            onClick={fetchParticipants}
            className="flex-1 px-4 py-2 bg-gray-200 text-[#00083B] text-sm rounded hover:bg-gray-300 transition duration-200"
          >
            View Participants
          </button>
        </div>
      </div>

      {/* Join Form Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            <h4 className="text-xl font-bold mb-4 text-center">Join Event</h4>
            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00083B]"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00083B]"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00083B]"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00083B] text-white rounded hover:bg-[#00083B]/90 transition"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h4 className="text-xl font-bold mb-4 text-center">Participants</h4>
            {fetchingParticipants ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#00083B]"></div>
              </div>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {participants.length === 0 ? (
                  <p className="text-center text-gray-500">No participants yet.</p>
                ) : (
                  participants.map((p) => (
                    <li key={p._id} className="border-b pb-4">
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.email}</p>
                      <p className="text-sm text-gray-600">{p.phone}</p>
                    </li>
                  ))
                )}
              </ul>
            )}
            <button
              onClick={() => setShowParticipants(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
