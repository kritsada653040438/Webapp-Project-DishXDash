import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  info: { type: String },
  img: { type: String },
});

export default mongoose.models.Food || mongoose.model('Food', FoodSchema);
