import connectDB from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const client = await connectDB();
    const database = client.db("AHSO_Event");
    const categoriesCollection = database.collection("categories");

    const categories = await categoriesCollection.find({}).toArray();
    const formatted = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
