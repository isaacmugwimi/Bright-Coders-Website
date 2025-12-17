import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import testDbConnection from "./Database/Config/config.db.js";
// backend starts here
const app = express();

//Midleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
// routes

const PORT = process.env.PORT;

testDbConnection().then(() =>
  app.listen(PORT, () => console.log("Server running on port: ", PORT))
);
