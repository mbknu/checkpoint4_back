const express = require("express");
const router = express.Router();
const facts = require("./facts");
const teams = require("./teams");
const auth = require("./auth");
const todo = require("./todo");

router.use("/facts", facts);
router.use("/teams", teams);
router.use("/auth", auth);
router.use("/todo", todo);

module.exports = router;
