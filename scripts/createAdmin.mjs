import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://Vercel-Admin-Axion:YGcppOb340k7voxp@axion.fah2soz.mongodb.net/?retryWrites=true&w=majority";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

await mongoose.connect(MONGODB_URI);

const existing = await Admin.findOne({ email: 'admin@axion.com' });
if (existing) {
  console.log('Admin already exists!');
} else {
  const hashed = await bcrypt.hash('Admin@123', 10);
  await Admin.create({ email: 'admin@axion.com', password: hashed, name: 'Admin' });
  console.log('Admin created successfully!');
}

await mongoose.disconnect();
