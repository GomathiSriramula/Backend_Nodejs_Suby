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
    const {
  productName,
  price,
  category,
  bestseller,
  description
} = req.body || {};

    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return resp.status(404).json({ error: "firm not found" });
    }

    // Coerce bestseller to boolean (FormData sends as string)
    const isBestseller = bestseller === 'true' || bestseller === true;

    const product = new Product({
      productName,
      price,
      category,
      bestseller: isBestseller,
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

const deleteProductById = async (req, resp) => {
  try {
    const productId = req.params.productId;

    // Find the product first to get firm reference
    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({ error: "No product found" });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    // Pull the product reference from the firm's products array
    if (product.firm) {
      await Firm.findByIdAndUpdate(product.firm, { $pull: { products: product._id } });
    }

    return resp.status(200).json({
      message: "Product deleted successfully",
      deletedProductId: product._id
    });

  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, resp) => {
  try {
    const productId = req.params.productId;
    const { productName, price, category, bestseller, description } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({ error: "Product not found" });
    }

    // Update fields
    if (productName) product.productName = productName;
    if (price) product.price = price;
    if (category) product.category = category;
    if (description) product.description = description;
    if (bestseller !== undefined) product.bestseller = bestseller === 'true' || bestseller === true;

    // Handle image update if provided
    if (req.file) {
      product.image = req.file.filename;
    }

    const updatedProduct = await product.save();
    resp.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  upload,
  addProduct,
  getProductByFirm,
  deleteProductById,
  updateProduct
};
