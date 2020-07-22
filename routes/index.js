const express = require("express");
const router = express.Router();
const facts = require("./facts");
const teams = require("./teams");
router.use("/facts", facts);
router.use("/teams", teams);

module.exports = router;
