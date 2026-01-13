const Product = require("../models/Product");
const Firm = require('../models/Firm')
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const addProduct = async (req, resp) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return resp.status(404).json({ error: "firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();
    firm.products.push(savedProduct._id); 

    await firm.save();
    resp.status(200).json({savedProduct})
  } catch (error) {
console.log(error);
resp.status(500).json({error:"Internal Server error"})
  }
};

const getProductByFirm =async(req,resp)=>
{
  try{
const firmId = req.params.firmId;

const firm = await Firm.findById(firmId);
if(!firm)
{
  return resp.status(404).json({error:"no firm found"});
}

const restuarantName = firm.firmName;
const products = await Product.find({firm : firmId})
resp.status(200).json({restuarantName,products});

  }catch(error)
  {
console.log(error);
resp.status(500).json({error:"Internal Server Error"})
  }
}

const deleteProductById = async(req,resp)=>
{
  try{
    const productId=req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct)
    {
      return resp.status(404).json({error:"No product Found"})
    }

  }catch(error)
  {
   console.log(error);
   resp.status(500).json({error:"Internal Server Error"})
  }
}

module.exports = {
  upload,
  addProduct,
  getProductByFirm,
  deleteProductById
};
