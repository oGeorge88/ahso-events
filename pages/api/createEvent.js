// pages/api/createEvent.js
import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const client = await connectDB();
    const db = client.db("AHSO_Event");
    const categoriesCollection = db.collection("categories");
    const eventsCollection = db.collection("events");

    const { name, date, time, category, description, imageURL } = req.body;

    // Validate required fields
    if (!name || !date || !time || !category || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find category document
    const categoryDoc = await categoriesCollection.findOne({ name: category });

    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }

    // Parse Date
    let day, month, year;
    if (date.includes("/")) {
      [day, month, year] = date.split("/").map(Number);
    } else if (date.length === 8) {
      day = parseInt(date.slice(0, 2));
      month = parseInt(date.slice(2, 4));
      year = parseInt(date.slice(4, 8));
    } else {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Parse Time
    let hour = 0;
    let minute = 0;
    const timeLower = time.toLowerCase().trim();

    if (timeLower.includes(":")) {
      const [h, m] = timeLower.split(":").map(Number);
      hour = h;
      minute = m;
    } else if (timeLower.endsWith("am") || timeLower.endsWith("pm")) {
      const isPM = timeLower.endsWith("pm");
      let timeNumber = parseInt(timeLower.replace(/am|pm/, ""));
      if (isPM && timeNumber < 12) timeNumber += 12;
      if (!isPM && timeNumber === 12) timeNumber = 0;
      hour = timeNumber;
      minute = 0;
    } else {
      const timeNumber = parseInt(timeLower);
      if (isNaN(timeNumber)) return res.status(400).json({ success: false, message: "Invalid time format" });
      hour = timeNumber;
      minute = 0;
    }

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
      return res.status(400).json({ success: false, message: "Invalid date or time values" });
    }

    const parsedDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date/time" });
    }

    const newEvent = {
      name,
      description,
      date: parsedDate,
      categoryId: new ObjectId(categoryDoc._id),
      createdAt: new Date(),
    };

    if (imageURL) newEvent.imageURL = imageURL;

    await eventsCollection.insertOne(newEvent);

    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error("Error inserting event:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}