/*import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await connectDB();
    const database = client.db("AHSO_Event");  // Changed from "au-event" to "AHSO Event"
    const events = database.collection("events");

    const { eventId, updateData } = req.body;

    if (!eventId || !ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    // Remove _id if present in updateData
    if (updateData?._id) {
      delete updateData._id;
    }

    const result = await events.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found or no changes made" });
    }

    res.status(200).json({ success: true, message: "Event updated successfully" });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}
*/