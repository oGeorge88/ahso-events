import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    category: "",
    imageURL: "",
  });

  const [adminPasscode, setAdminPasscode] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        } else {
          setCategories([
            { id: "1", name: "Seminar" },
            { id: "2", name: "Workshop" },
            { id: "3", name: "Social" },
            { id: "4", name: "Religious" },
            { id: "5", name: "Academic" },
          ]);
        }
      } catch {
        setCategories([
          { id: "1", name: "Seminar" },
          { id: "2", name: "Workshop" },
          { id: "3", name: "Social" },
          { id: "4", name: "Religious" },
          { id: "5", name: "Academic" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, imageURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelect = (catName) => {
    setFormData((prev) => ({ ...prev, category: catName }));
  };

  const convertDateFormat = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (adminPasscode !== "adminispowerful") {
      setError("Invalid admin passcode.");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = formData.date ? convertDateFormat(formData.date) : "";

      const res = await fetch("/api/createEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: formattedDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      alert("Event created successfully!");
      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => router.back()}
          className="text-xl mb-6 text-gray-700 hover:text-gray-900 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center sm:text-left">
          Create a new event
        </h1>

        {error && (
          <p className="text-red-600 mb-5 font-semibold text-center sm:text-left">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-6
                     sm:p-8 sm:space-y-8"
        >
          {/* Name input */}
          <input
            name="name"
            placeholder="Event Title"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            required
            spellCheck={false}
          />

          {/* Description input */}
          <textarea
            name="description"
            placeholder="Type the description..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 resize-none shadow-sm"
            required
            spellCheck={true}
          />

          {/* Date and Time - stack on mobile, side by side on sm+ */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-md text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="flex-1 p-3 border border-gray-300 rounded-md text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          {/* Admin Passcode */}
          <input
            type="password"
            value={adminPasscode}
            onChange={(e) => setAdminPasscode(e.target.value)}
            placeholder="Enter Admin Passcode"
            className="w-full p-4 border border-gray-300 rounded-md text-gray-900 bg-white
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            required
          />

          {/* Image/Video Upload */}
          <div>
            <label className="font-semibold text-gray-900 block mb-2">Attach an image or video</label>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl font-bold transition-colors ${
                  formData.imageURL
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } shadow-md`}
                aria-label="Toggle upload options"
              >
                +
              </button>

              {formData.imageURL && (
                <div className="w-32 h-32 relative rounded-md overflow-hidden border border-gray-300 shadow-sm">
                  <Image
                    src={formData.imageURL}
                    alt="Attached preview"
                    fill
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                </div>
              )}
            </div>

            {showUploadOptions && (
              <div className="mt-4 border border-gray-300 rounded-md p-4 bg-white shadow-inner">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition text-indigo-700 font-medium"
                >
                  Upload image from gallery
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
                  placeholder="Or paste video URL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  className="mt-3 p-3 border border-gray-300 rounded-md w-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="font-semibold text-gray-900 block mb-2">Category</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-shadow ${
                    formData.category === cat.name
                      ? "bg-indigo-700 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => handleCategorySelect(cat.name)}
                  aria-pressed={formData.category === cat.name}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 transition-colors text-white py-4 rounded-md w-full text-center font-semibold text-lg shadow-md disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
