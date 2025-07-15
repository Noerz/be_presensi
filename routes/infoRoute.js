const express = require("express");
const { getProjectInfo } = require("../controller/infoController");

const router = express.Router();

router.get("/info", getProjectInfo);

module.exports = router;