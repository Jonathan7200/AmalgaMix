// imports
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import config from "./config.js";

mongoose.set("debug", true);

// connecting to database: checking to make sure it connects properly
const connectDB = async () => {
    try {
        // const conn = await mongoose.connect(config.env.MONGO, {
        //     //must add in order to not get any error messages:
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true
        // });
        const conn = await mongoose.connect(MONGO_URI)
        console.log(`mongo database is connected!!! ${conn.connection.host} `);
    } catch (error) {
        console.error(`Error: ${error} `);
    }
};


export default {
    connectDB
};
