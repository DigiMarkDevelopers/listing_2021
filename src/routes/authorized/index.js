const express = require('express');
const router = express.Router();

//get defined routes
const clientsRoutes = require('./client.route');
const propertyListingRoutes = require('./property-listing.route');


//call appropriate routes
router.use ('/clients', clientsRoutes);
router.use ('/property-listing', propertyListingRoutes);

module.exports = router;
