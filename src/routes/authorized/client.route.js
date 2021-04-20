const express = require("express");
const router = express.Router();
var permit = require("../../middlewares").permit;
const controller = require("../../controllers").client;

// non-restricted routes
router.post("/get", controller.getClient);
router.post("/get_by_id", controller.getClientById);
router.post("/create", controller.createClient);
router.post("/update", controller.updateClient);
router.post("/delete", controller.removeClient);

module.exports = router;
