/*import connectDB from "@/lib/mongodb"

export default async function handler(req, res) {
    const client = await connectDB();
    const database = client.db("AHSO_Event"); 
    const events = database.collection("events");

    const today = new Date();

    const pastEvents = await events.find({
      date: { $gte: today }
    }).sort({date: -1}).toArray();

    res.status(200).json({ success: true, data: pastEvents });
}
*/