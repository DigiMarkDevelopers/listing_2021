const express = require('express');
const router = express.Router();

const controller = require('../../controllers').property_listing;

// non-restricted routes
router.post('/get', controller.getPropertyListing);
router.post('/get_all', controller.getPropertyListingAll);
router.post('/create', controller.createPropertyListing);
router.post('/update', controller.updatePropertyListing);
router.post('/delete', controller.removePropertyListing);
router.post("/get_by_id",controller.getPropertyById)
router.post("/get_by_filter",controller.getPropertyFilterListing)

module.exports = router;
