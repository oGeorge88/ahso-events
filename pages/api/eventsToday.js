import connectDB from "@/lib/mongodb"

export default async function handler(req, res) {
    const client = await connectDB();
    const database = client.db("AHSO_Event");  // Changed from "au-event" to "AHSO Event"
    const events = database.collection("events");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysEvents = await events.find({
      date: { $gte: today, $lt: tomorrow }
    }).toArray();

    res.status(200).json({ success: true, data: todaysEvents });
}
