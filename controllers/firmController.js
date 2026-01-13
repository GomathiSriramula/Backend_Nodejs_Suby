const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");  
const path = require("path");


 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");   // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage});


const addFirm = async(req,resp)=>
{
  try
  {
    const {firmName,area,category,region,offer} = req.body;

  const image = req.file?req.file.filename:undefined;
  const vendor = await Vendor.findById(req.vendorId);

  if(!vendor)
  {
    res.status(404).json({message:"Vendor not found"})
  }
  const firm = new Firm({
    firmName,area,category,region,offer,image,vendor:vendor._id
  })

  const savedFirm = await firm.save();
  vendor.firm.push(savedFirm);

  await vendor.save();
  return resp.status(200).json({message:"firm added successfully🔥"})
  }
  catch(error)
  {
    console.error(error);
    resp.status(500).json("internal Server Error")
  }
}

const deleteFirmById = async(req,resp)=>
{
  try{
  const firmId = req.params.firmId;
  const deletedFirm = await Firm.findByIdAndDelete(firmId);

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

module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}
