import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://hacknext-plum.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "GET is successful" });
});

export { app };
