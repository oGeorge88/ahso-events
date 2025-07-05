/*import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const client = await connectDB();
    const database = client.db("AHSO_Event"); 

    const categoriesCollection = database.collection("categories");
    const eventsCollection = database.collection("events");

    // Get category name from query params
    const { categoryName } = req.query;

    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Find category by name
    const category = await categoriesCollection.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Find events with the matching categoryId
    const events = await eventsCollection.find({ categoryId: category._id }).toArray();

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
*/