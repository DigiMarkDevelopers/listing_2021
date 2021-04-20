const express = require('express');
const router = express.Router();

//get defined routes
const clientsRoutes = require('./client.route');

//call appropriate routes
router.use ('/clients', clientsRoutes);

module.exports = router;
