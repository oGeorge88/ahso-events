// pages/api/admin/events/index.js
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const client = await connectDB();
    const db = client.db("AHSO_Event");
    const eventsCollection = db.collection("events");
    const categoriesCollection = db.collection("categories");

    const { name, description, date, time, category, imageURL } = req.body;

    // Validate required fields
    if (!name || !description || !date || !time || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const categoryDoc = await categoriesCollection.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const [hourStr, minuteStr] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return res.status(400).json({ success: false, message: "Invalid time format" });
    }

    const fullDate = new Date(dateObj);
    fullDate.setHours(hour, minute, 0, 0);

    const newEvent = {
      name,
      description,
      date: fullDate,
      categoryId: new ObjectId(categoryDoc._id),
      createdAt: new Date(),
    };

    if (imageURL) newEvent.imageURL = imageURL;

    await eventsCollection.insertOne(newEvent);

    return res.status(201).json({ success: true, message: "Event created successfully", data: newEvent });
  } catch (error) {
    console.error("Error in POST /api/admin/events:", error);
    return res.status(500).json({ success: false, message: "Server error during event creation" });
  }
}
