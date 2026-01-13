const express = require('express');
const dotenv = require('dotenv');
const vendorRoutes = require("./routes/vendorRoutes")
const firmRoutes = require("./routes/firmRoutes")
const productRoutes = require("./routes/productRoutes")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); 

const app = express();

const PORT = process.env.PORT||4000;

dotenv.config();
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected successfully 🚀");
})
.catch((error) => {
  console.log("MongoDB connection failed ❌", error);
})

app.use("/home", (req, res) => {
  res.send('<h1>Welcome to Vendor Management System</h1>');
});


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/vendor",vendorRoutes);
app.use("/firm",firmRoutes);
app.use("/product",productRoutes);
app.use("/uploads",express.static('uploads'));//for IMAGES



app.listen(PORT, () => {
  console.log(`Server started and running at ${PORT}`);
});
