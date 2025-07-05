import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid event ID' });
  }

  let client;

  try {
    client = await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }

  const db = client.db('AHSO_Event');
  const events = db.collection('events');

  switch (method) {
    case 'PUT':
      try {
        const { name, description, date, imageURL, participants } = req.body;

        if (!name || !description || !date) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields: name, description, or date',
          });
        }

        // Parse date string to Date object safely
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        const result = await events.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              name,
              description,
              date: parsedDate,  // <-- Use parsed Date here
              imageURL: imageURL || '',
              participants: participants || [],
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }

        return res.status(200).json({ success: true, message: 'Event updated successfully' });
      } catch (error) {
        console.error('PUT error:', error);
        return res.status(500).json({ success: false, message: 'Server error during update' });
      }

    case 'DELETE':
      try {
        const result = await events.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }
        return res.status(200).json({ success: true, message: 'Event deleted successfully' });
      } catch (error) {
        console.error('DELETE error:', error);
        return res.status(500).json({ success: false, message: 'Server error during deletion' });
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
  }
}
