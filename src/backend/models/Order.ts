import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalPrice: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  status: { type: String, default: 'pending' },
  adminMessage: { type: String, default: '' },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
