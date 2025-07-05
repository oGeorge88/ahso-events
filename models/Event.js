// models/Event.js
import mongoose, { Schema } from 'mongoose';

const ParticipantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

const EventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  imageURL: { type: String },
  participants: [ParticipantSchema],
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
