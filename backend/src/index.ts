import express from "express";
import App from "./app";
import { connectDB } from "./config/db";
import dotenv from "./config/dotenv";

const PORT = dotenv.PORT;

const startServer = async () => {
  const app = express();
  /**
   * Connect database
   */
  connectDB().then(async () => {
    await App(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
};

startServer();
