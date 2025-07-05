/*import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const client = await connectDB();
    const database = client.db("AHSO_Event"); 
    const categoriesCollection = database.collection("categories");
    const eventsCollection = database.collection("events");

    const { name, date, time, category, description, imageURL } = req.body;
    console.log(req.body)

    if (!name || !date || !time || !category || !description || !imageURL) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const categoryDoc = await categoriesCollection.findOne({ name: category });

    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }

    const categoryId = categoryDoc._id;

    console.log(date)
    const dateParts = date.split("/");
    const timeParts = time.split(":");

    // Create the Date object (UTC format)
    const parsedDate = new Date(
        Number(dateParts[2]),  // Year (2025)
        Number(dateParts[1]) - 1, // Month (0-based, so subtract 1)
        Number(dateParts[0]),  // Day
        Number(timeParts[0]),  // Hour
        Number(timeParts[1])   // Minutes
    );

    // Convert to ISO string (UTC)
    const isoString = parsedDate.toISOString();

    const newEvent = {
      name,
      description,
      imageURL,
      date: new Date(isoString), // Store the merged date-time object
      categoryId: new ObjectId(categoryId),
      createdAt: new Date(),
    };

    const result = await eventsCollection.insertOne(newEvent);

    res.status(201).json({ success: true, data: newEvent });

  } catch (error) {
    console.error("Error inserting event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}*/
