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

    // Remove firm reference from vendor
    if (deletedFirm.vendor) {
      await Vendor.findByIdAndUpdate(deletedFirm.vendor, { $pull: { firm: firmId } });
    }

    return resp.status(200).json({
      message: "Firm deleted successfully"
    });

  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- UPDATE FIRM ---------------- */

const updateFirm = async (req, resp) => {
  try {
    const firmId = req.params.firmId;
    const { firmName, area, category, region, offer } = req.body;

    // Find the firm
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return resp.status(404).json({ error: "Firm not found" });
    }

    // Update fields
    if (firmName) firm.firmName = firmName;
    if (area) firm.area = area;
    if (category) firm.category = category;
    if (region) firm.region = region;
    if (offer) firm.offer = offer;

    // Handle image update if provided
    if (req.file) {
      firm.image = req.file.filename;
    }

    const updatedFirm = await firm.save();
    resp.status(200).json({ message: "Firm updated successfully", updatedFirm });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
};

/* ---------------- EXPORT ---------------- */

module.exports = {
  addFirm: [upload.single("image"), addFirm],
  deleteFirmById,
  updateFirm: [upload.single("image"), updateFirm]
};
