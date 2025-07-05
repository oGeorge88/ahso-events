import connectDB from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await connectDB();
  const database = client.db("AHSO_Event");
  const events = database.collection("events");

  const today = new Date();

  const upcomingEvents = await events.find({
    date: { $gte: today }
  })
  .project({
    _id: 1,            // ✅ Always include the _id
    name: 1,
    description: 1,
    date: 1,
    imageURL: 1,
    categoryId: 1
  })
  .sort({ date: 1 })
  .toArray();

  res.status(200).json({ success: true, data: upcomingEvents });
}
