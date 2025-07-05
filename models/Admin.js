// models/Admin.js
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed passwords in production
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
