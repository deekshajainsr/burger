import express from "express";
import { Order } from "../models/Order.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

// Place order (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice, userEmail } = req.body;
    const userId = (req as any).user.id;

    const order = new Order({
      items,
      totalPrice,
      userId,
      userEmail,
    });

    await order.save();
    const obj = order.toObject();
    res.status(201).json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get my orders (Protected)
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders.map(o => {
      const obj = o.toObject();
      return { ...obj, id: obj._id.toString() };
    }));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin: Get all orders
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // In a real app, check if user is admin
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(o => {
      const obj = o.toObject();
      return { ...obj, id: obj._id.toString() };
    }));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

// Update order status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status, adminMessage } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status, adminMessage }, 
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
    const obj = updatedOrder.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;
