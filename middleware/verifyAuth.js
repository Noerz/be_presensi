const jwt = require("jsonwebtoken");
const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const multer = require("multer");
const path = require("path");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.decoded = decoded;
    console.log("isi dari token :"+decoded);
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await models.user.findOne({
      where: { email: decoded.email },
    });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Hanya admin yang dapat mengakses" });
    }

    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

// Define storage for the images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // define the directory to save the images
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 1MB file size limit
  
});

module.exports = { verifyToken, isAdmin, upload };
