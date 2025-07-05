/*import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connectDB();
  const database = client.db("AHSO_Event");  // Changed from "au-event" to "AHSO Event"
  const events = database.collection("events");

  const { eventId } = req.body;

  if (!eventId || !ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
  }

  const result = await events.deleteOne({ _id: new ObjectId(eventId) });

  if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.status(200).json({ success: true, message: "Event deleted successfully" });
}
*/