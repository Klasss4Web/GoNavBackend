import mongoose from "mongoose";
// import logger from "../utils/logger.ts";

const connectToDataBase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    // if (!uri) {
    //   throw new Error("MONGO_URI environment variable is not defined");
    // }

    // const connection = mongoose.connect(uri);
    console.log("Mongo dB Connected", connection);
    // logger.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error connecting to MongoDB: ${message}`);
    // logger.error(`MongoDB Connection Error: ${message}`);
    // throw new Error(`Error:, ${error.message}`);
    process.exit(1);
  }
};

export default connectToDataBase;
