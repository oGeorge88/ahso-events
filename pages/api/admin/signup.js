import connectDB from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const client = await connectDB();
  const db = client.db('AHSO_Event');
  const existing = await db.collection('admins').findOne({ email });

  if (existing) {
    return res.status(409).json({ message: 'Admin already exists' });
  }

  await db.collection('admins').insertOne({ username, email });
  return res.status(201).json({ success: true });
}
