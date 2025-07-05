// components/EventForm.js
import { useState } from 'react';

export default function EventForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    imageURL: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/createEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onAdd(data.event);
        setFormData({ name: '', description: '', date: '', imageURL: '' });
      } else {
        alert('Failed to create event.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg mb-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Event Name"
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Event Description"
        rows="3"
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="url"
        name="imageURL"
        value={formData.imageURL}
        onChange={handleChange}
        placeholder="Event Image URL"
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Add Event'}
      </button>
    </form>
  );
}
