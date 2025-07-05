import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await connectDB();
    const db = client.db("AHSO_Event");
    const eventsCollection = db.collection("events");
    const categoriesCollection = db.collection("categories");

    const events = await eventsCollection.find({}).toArray();
    const categories = await categoriesCollection.find({}).toArray();

    // Create a map of categoryId -> name
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    const enhancedEvents = events.map((event) => ({
      ...event,
      category: categoryMap[event.categoryId?.toString()] || "Uncategorized",
      _id: event._id.toString(),
      date:
        event.date && typeof event.date.toISOString === "function"
          ? event.date.toISOString()
          : null,
    }));

    res.status(200).json({ success: true, data: enhancedEvents });
  } catch (error) {
    console.error("Error in eventsAll:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
