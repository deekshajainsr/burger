import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Import Routes
import authRoutes from "./src/backend/routes/authRoutes.ts";
import productRoutes from "./src/backend/routes/productRoutes.ts";
import orderRoutes from "./src/backend/routes/orderRoutes.ts";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Deeksha:Deeksha%40123@cluster0.thht8n2.mongodb.net/burgershop";

// Connect to MongoDB with timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    // Don't exit, let the server start so health checks pass, 
    // but API calls will fail later which is better than a crash loop
  });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check for Cloud Run - Move to top to ensure it responds even if other things are slow
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);

  // Seed endpoint
  app.post("/api/seed", async (req, res) => {
    try {
      const { Product } = await import("./src/backend/models/Product.ts");
      const products = [
        { name: "Classic Burger", price: 10, description: "Juicy beef patty with lettuce, tomato, and our secret sauce.", image: "https://picsum.photos/seed/burger1/400/300" },
        { name: "Cheese Burger", price: 12, description: "Classic burger topped with melted cheddar cheese.", image: "https://picsum.photos/seed/burger2/400/300" },
        { name: "Bacon Burger", price: 14, description: "Crispy bacon strips on top of a juicy beef patty.", image: "https://picsum.photos/seed/burger3/400/300" },
        { name: "Veggie Burger", price: 11, description: "Plant-based patty with fresh greens and avocado.", image: "https://picsum.photos/seed/burger4/400/300" },
        { name: "Double Patty Burger", price: 16, description: "Two beef patties for the ultimate hunger.", image: "https://picsum.photos/seed/burger5/400/300" },
      ];
      
      await Product.deleteMany({});
      await Product.insertMany(products);
      res.json({ message: "Seeded successfully" });
    } catch (error) {
      console.error("Error seeding:", error);
      res.status(500).json({ error: "Failed to seed" });
    }
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production";
  
  if (!isProd) {
    console.log("Starting in development mode with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
