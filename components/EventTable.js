// components/EventTable.js
import { useState } from 'react';

export default function EventTable({ events, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEditing = (event) => {
    setEditingId(event._id);
    setEditData(event);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const res = await fetch('/api/updateEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    const data = await res.json();
    if (data.success) {
      onUpdate(editData);
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/deleteEvent?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Description</th>
            <th className="text-left py-2 px-4">Date</th>
            <th className="text-left py-2 px-4">Image URL</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="border-t">
              <td className="py-2 px-4">
                {editingId === event._id ? (
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="border p-1 rounded w-full bg-white text-black"
                  />
                ) : (
                  event.name
                )}
              </td>
              <td className="py-2 px-4">
                {editingId === event._id ? (
                  <input
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    className="border p-1 rounded w-full bg-white text-black"
                  />
                ) : (
                  event.description
                )}
              </td>
              <td className="py-2 px-4">
                {editingId === event._id ? (
                  <input
                    name="date"
                    type="date"
                    value={editData.date?.split('T')[0]}
                    onChange={handleChange}
                    className="border p-1 rounded w-full bg-white text-black"
                  />
                ) : (
                  new Date(event.date).toLocaleDateString()
                )}
              </td>
              <td className="py-2 px-4">
                {editingId === event._id ? (
                  <input
                    name="imageURL"
                    value={editData.imageURL}
                    onChange={handleChange}
                    className="border p-1 rounded w-full bg-white text-black"
                  />
                ) : (
                  event.imageURL
                )}
              </td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                {editingId === event._id ? (
                  <>
                    <button onClick={handleUpdate} className="text-green-600">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(event)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(event._id)} className="text-red-600">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
