//import mongoose and models
var mongoose = require("mongoose");

var config = require("dotenv").config();
const fs = require("fs");

//Lodash for data manipulation
const _ = require("lodash");

var PropertyListing = mongoose.model("PropertyListing");
var Client = mongoose.model("Client");
const propertyListingHelper = require("../helpers/property-listing.helper");

responseHelper = require("../helpers/response.helper");

const constants = require("../hardCodedData").constants;

var pageSize = parseInt(config.PAGE_SIZE);

var createPropertyListing = async (req, res) => {
  console.log("request received for createPropertyListing");
  try {
    var reqProp = req.body;
    const user_exists = await Client.findOne({ user_id: req.body.user_id });
    if (user_exists == null) {
      return responseHelper.requestfailure(res, "User Not Found With this Id");
    }
    reqProp.client = user_exists._id;
    const property = new PropertyListing(reqProp);
    await property.save();
    var message = "Property created successfully";
    return responseHelper.success(res, property, message);
  } catch (err) {
    if (err.message.includes("E11000 duplicate")) {
      return responseHelper.requestfailure(
        res,
        `Property with this Id ${req.body.property_id} Already exist`
      );
    }
    responseHelper.requestfailure(res, err);
  }
};

var getPropertyListing = async (req, res) => {
  console.log("request received for getPropertyListing");
  try {
    let query = {};
    let client = {};
    var limit = parseInt(req.body.limit);
    var page = req.body.page ? parseInt(req.body.page) : 1;
    var skip = (page - 1) * limit;

    if (req.body.user_name) {
      client = await Client.findOne({ user_name: req.body.user_name }).lean();
      if (client) {
        query = { client: client._id };

        var responses = await Promise.all([
          PropertyListing.find(query)
            .skip(skip)
            .limit(limit)
            .populate("client")
            .lean(),
          PropertyListing.count(query).lean(),
        ]);

        const properties = responses[0];
        var total = responses[1];
        var message = "Properties fetched successfully";
        return responseHelper.success(
          res,
          { total, client, properties },
          message
        );
      }
      responseHelper.requestfailure(res, err);
    } else {
      var responses = await Promise.all([
        PropertyListing.find({})
          .skip(skip)
          .limit(limit)
          .populate("client")
          .lean(),
        PropertyListing.count({}).lean(),
      ]);

      const properties = responses[0];
      var total = responses[1];

      var message = "Properties fetched successfully";
      return responseHelper.success(
        res,
        { total, client, properties },
        message
      );
    }
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var updatePropertyListing = async (req, res) => {
  console.log("request received for updatePropertyListing");
  try {
    let query = {};
    query.property_id = req.body.property_id;
    var update = req.body;
    delete update.property_id;
    const property = await PropertyListing.findOneAndUpdate(query, update, {
      new: true,
    });
    var message = "Property updated successfully";
    return responseHelper.success(res, property, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var removePropertyListing = async (req, res) => {
  console.log("request received for removePropertyListing");
  try {
    const check_property = await PropertyListing.findOne({
      property_id: req.body.property_id,
    }).lean();
    if (check_property) {
      const property = await PropertyListing.findOneAndRemove({
        property_id: req.body.property_id,
      });
      var message = "Property removed successfully";
      return responseHelper.success(res, property.property_id, message);
    } else {
      responseHelper.requestfailure(res, "Property Not Found");
    }
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var getPropertyListingAll = async (req, res) => {
  console.log("request received for removePropertyListing");
  try {
    let query = {};
    if (req.body) {
      query = req.body;
    }
    const properties = await PropertyListing.find(query).populate("client");
    var message = "Property List successfully";
    return responseHelper.success(res, properties, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var getPropertyById = async (req, res) => {
  try {
    const property = await PropertyListing.findById(
      req.body.propertyId
    ).populate("client");
    var message = "Property fetched successfully";
    return responseHelper.success(res, property, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var getPropertyFilterListing = async (req, res) => {
  try {
    let {
      user_id,
      client_id,
      min_price,
      max_price,
      min_sf,
      max_sf,
      location,
      category,
    } = req.body;
    let query = {};

    if (client_id) {
      query.client = client_id;
    }

    if (min_price || max_price) {
      if(max_price>=500001){
        query.price = { $gte: parseInt(min_price)};
      }else{
        query.price = { $gte: parseInt(min_price), $lte: parseInt(max_price) };
      }
    }
    if (min_sf || max_sf) {
      if(max_sf>=5001){
        query.square_ft = { $gte: parseInt(min_sf)};
      }else{
        query.square_ft = { $gte: parseInt(min_sf), $lte: parseInt(max_sf) };
      }
     
    }
    if (location) {
      query.city = location;
    }
    if (category) {
      query.category = category;
    }
    var limit = parseInt(req.body.limit || 10);
    var page = req.body.page ? parseInt(req.body.page) : 1;
    var skip = (page - 1) * limit;
    var responses = await Promise.all([
      PropertyListing.find(query)
        .skip(skip)
        .limit(limit)
        .populate("client")
        .lean(),
      PropertyListing.count(query).lean(),
    ]);
    var message = "Properties filter fetched successfully";
    const properties = responses[0];
    var total = responses[1];
    return responseHelper.success(res, { total, properties }, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

module.exports = {
  createPropertyListing,
  getPropertyListing,
  updatePropertyListing,
  removePropertyListing,
  getPropertyListingAll,
  getPropertyById,
  getPropertyFilterListing,
};
