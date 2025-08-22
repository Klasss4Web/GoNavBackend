import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import connectToDataBase from "./configs/database.js";
import notificationRoute from "./routes/notificationRoute.js";

dotenv.config();
connectToDataBase();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/push-notification", notificationRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

//ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 2000;

app.listen(PORT, console.log(`Server running in port ${PORT}`));
