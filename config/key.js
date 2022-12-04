require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  // MONGO_URI:"mongodb://localhost:27017/VM_Finance",
  MONGO_URI: process.env.MONGODBURI
};
