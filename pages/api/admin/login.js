import connectDB from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  const client = await connectDB();
  const db = client.db('AHSO_Event');
  const admin = await db.collection('admins').findOne({ email });

  if (!admin || password !== 'adminispowerful') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // You can later implement JWT here.
  return res.status(200).json({ success: true });
}
