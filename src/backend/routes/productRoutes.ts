import express from "express";
import { Product } from "../models/Product.ts";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(p => {
      const obj = p.toObject();
      return { ...obj, id: obj._id.toString() };
    }));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product (Admin only - for simplicity we just allow it for now)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    const obj = product.toObject();
    res.status(201).json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    const obj = updatedProduct.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
