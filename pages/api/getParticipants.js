import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Missing eventId' });
  }

  try {
    const client = await connectDB();
    const database = client.db("AHSO_Event");
    const events = database.collection("events");

    console.log(`Looking for eventId: ${eventId}`);
    const event = await events.findOne(
      { _id: new ObjectId(eventId) },
      { projection: { participants: 1, _id: 0 } }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Ensure participants is always an array
    const participants = Array.isArray(event.participants) ? event.participants : [];

    console.log("Participants:", participants); // Debug log
    return res.status(200).json({
      success: true,
      participants
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
}
