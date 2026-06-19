const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lead-captur-ai";


  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoURI);
  console.log('MongoDB Connected Successfully!');
};

module.exports = connectDB;

