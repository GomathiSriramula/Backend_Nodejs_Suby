const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")

dotenv.config();
const secretKey = process.env.whatIsYourName;

//Creating MiddleWare
const verifyToken = async(req,resp,next)=>
{
  const token = req.headers.token;
  if(!token)
  {
    return resp.status(401).json({error:"Token is required"});
  }
  try
  {
  const decoded = jwt.verify(token,secretKey);
  const vendor = await Vendor.findById(decoded.vendorId);
  if(!vendor)
  {
    return resp.status(404).json({error:"vendor not found"})
  }
   req.vendorId = vendor._id;

   next()
  }
  catch(error)
  {
   console.log(error);
   return resp.status(500).json({error:"invalid token"});
  }
}

module.exports = verifyToken;