import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import { app } from "./src/config/app.js";
import { connection } from "./src/config/database.js";

// Import routes
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import savedRoutes from "./src/routes/savedRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Use routes
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", eventRoutes);
app.use("/", projectRoutes);
app.use("/", applicationRoutes);
app.use("/", savedRoutes);
app.use("/", publicRoutes);
app.use("/api/email", emailRoutes);

// Start server
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

connection().then(() => {
  const port = process.env.PORT || 5678;
  app.listen(port, () => console.log(`Server running at port ${port}`));
});
