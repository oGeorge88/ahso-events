import connectDB from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { eventId, name, email } = req.body;

    if (!eventId || !name || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      const client = await connectDB();
      const database = client.db("AHSO_Event");
      const events = database.collection("events");

      console.log(`Adding participant: ${name}, ${email} to event ${eventId}`);

      // 👇 Add the participant (MongoDB will create the 'participants' array if it doesn't exist)
      const result = await events.updateOne(
        { _id: new ObjectId(eventId) },
        { $push: { participants: { name, email } } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: 'Event not found or participant not added' });
      }

      return res.status(200).json({
        success: true,
        message: 'Participant added successfully!'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
