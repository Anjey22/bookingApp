const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGOBD_URL;
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL, { });
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB Connection unsuccessful:', error);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

module.exports = mongoose;


/*const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://hotel:Anjey%40171103@cluster0.h0hva7t.mongodb.net/hotel";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL, {

        });
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB Connection unsuccessful:', error);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

module.exports = mongoose;*/
