const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

/* ---------------- MULTER SETUP ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");   // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ---------------- ADD FIRM ---------------- */

const addFirm = async (req, resp) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return resp.status(404).json({ message: "Vendor not found" });
    }

    // Only one firm allowed per vendor
    if (vendor.firm.length > 0) {
      return resp.status(400).json({ message: "Only one firm allowed per vendor" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return resp.status(200).json({
      message: "Firm added successfully 🔥",
      firmId: savedFirm._id
    });

  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- DELETE FIRM ---------------- */

const deleteFirmById = async (req, resp) => {
  try {
    const firmId = req.params.firmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return resp.status(404).json({ error: "No firm found" });
    }

    return resp.status(200).json({
      message: "Firm deleted successfully"
    });

  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- EXPORT ---------------- */

module.exports = {
  addFirm: [upload.single("image"), addFirm],
  deleteFirmById
};
