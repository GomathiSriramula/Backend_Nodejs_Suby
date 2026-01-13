const Vendor = require("../models/Vendor"); //getting the Vendor model
const jwt = require("jsonwebtoken"); // for authentications
const bcrypt = require("bcryptjs"); //For hashing passwords
const dotenv = require("dotenv");

dotenv.config();
secretKey = process.env.whatIsYourName;
/*
const vendorRegister = async (req, resp) => {
  const { username, email, password } = req.body; //getting details from req body from form

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return resp.status(400).json("Email already taken");
    }
    const hashedPassword = await bcrypt.hash(password, 10); //exceutes for 10 times and stores in hashedPassword

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();

    resp.status(201).json({ message: "Vendor registered Successfully!" });
    console.log("registerd");
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};*/

const vendorRegister = async (req, resp) => {
  console.log("BODY =>", req.body);   // 🔍 debug

  const { username, email, password } = req.body;

  // ✅ Validation FIRST
  if (!username || !email || !password) {
    return resp.status(400).json({ error: "All fields are required" });
  }

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return resp.status(400).json({ error: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();

    resp.status(201).json({ message: "Vendor registered Successfully!" });
    console.log("registered");
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};


const vendorLogin = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return resp.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      expiresIn: "1h",
    });

    resp.status(200).json({ success: "Login Successful!", token });
    console.log(email, "this is token", token);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllVendors = async(req,resp)=>
{
  try{

    const vendors = await Vendor.find().populate('firm');
    resp.json({vendors})
  }catch(error){
   console.log(error);
   resp.status(500).json({error:"Internal Server Error"});
  }
}

const getVendorId = async(req,resp)=>
{
  const vendorId = req.params.id;

  try
  {
    const vendor = await Vendor.findById(vendorId).populate('firm');

    if(!vendorId)
    {
     return resp.status(404).json({error:"vendor not found"})
    }
    resp.status(200).json({vendor})
  }
  catch(error)
  {
 console.log(error);
   resp.status(500).json({error:"Internal Server Error"});
  }
}
module.exports = { vendorRegister, vendorLogin,getAllVendors,getVendorId};
