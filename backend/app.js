import express from "express";
import authRoutes from "./app/auth/auth.routes.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});