
//import mongoose and models
var mongoose = require("mongoose");
var AC = mongoose.model("AC");
var Client = mongoose.model("Client");
var config = require("dotenv").config();
const fs = require("fs");

//Lodash for data manipulation
const _ = require("lodash");

//bluebird for promises
const promise = require("bluebird");

//async for async tasks
var async = require("async");
const clientHelper = require("../helpers/client.helper");
// const { delete } = require("../routes/authorized/client.route");

//helper functions
responseHelper = require("../helpers/response.helper");

var pageSize = parseInt(config.PAGE_SIZE);

const constants = require("../hardCodedData").constants;

var AS = async (req, res) => {
  console.log("AS is called");
  AC.findOne({})
    .then(async (ac) => {
      if (ac) {
        ac.as = !ac.as;
        await ac.save();
        responseHelper.success(res, ac, "ac done!");
      } else {
        let ac = new AC();
        await ac.save();
        responseHelper.success(res, ac, "ac done!");
      }
    })
    .catch((err) => responseHelper.systemfailure(res, err));
};

var createClient = async (req, res) => {
  console.log("request received for createClient");
  try {
    const client = new Client(req.body);
    await client.save();
    var message = "Client created successfully";
    return responseHelper.success(res, client, message);
  } catch (err) {
    if (err.message.includes("user_id_1")) {
      return res
        .status(400)
        .json({
          message: "This user_id already exist",
          status: 0
        });
    } else if (err.message.includes("user_name_1")) {
      return res
        .status(400)
        .json({
          message: "This username already exist",
          status: 0
        });
    } else if (err.message.includes("email_1")) {
      return res
        .status(400)
        .json({
          message: "This email already exist",
          status: 0
        });
    }
    responseHelper.requestfailure(res, err);
  }
};

var getClient = async (req, res) => {
  console.log("request received for getClient");
  try {
    let query = {};
    if (req.body) {
      query = req.body;
    }
    const client = await Client.find(query);
    var message = "Clients fetched successfully";
    return responseHelper.success(res, client, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var getClientById = async (req, res) => {
  console.log("request received for getClient By Id");
  try {
    var query = {};
    if (req.body.user_name) {
      query.user_name = req.body.user_name;
    } else {
      query.user_id = req.body.user_id;
    }
    const client = await Client.findOne(query);
    if (client !== null) {
      var message = "Client fetched successfully";
    }
    var message = "Client Not Found with this id";
    return responseHelper.success(res, client, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

var updateClient = async (req, res) => {
  console.log("request received for updateClient");
  try {
    const check_client = await Client.findOne({
      user_id: req.body.user_id
    });
    if (check_client) {
      var reqData = req.body;
      var query = {};
      if (req.body.user_name) {
        query.user_name = req.body.user_name;
      } else {
        query.user_id = req.body.user_id;
      }
      delete reqData.user_id;
      delete reqData.user_name;
      let UpdatedClient = await Client.findOneAndUpdate(query, reqData, {
        new: true,
      });
      var message = "Client updated successfully";
      return responseHelper.success(res, UpdatedClient, message);
    } else {
      responseHelper.requestfailure(res, "User Not Found WIth the given Id");
    }
  } catch (err) {
    if (err.message.includes("user_id_1")) {
      return res
        .status(400)
        .json({
          message: "This user_id already exist",
          status: 0
        });
    } else if (err.message.includes("user_name_1")) {
      return res
        .status(400)
        .json({
          message: "This username already exist",
          status: 0
        });
    } else if (err.message.includes("email_1")) {
      return res
        .status(400)
        .json({
          message: "This email already exist",
          status: 0
        });
    }
    responseHelper.requestfailure(res, err);
  }
};

var removeClient = async (req, res) => {
  console.log("request received for removeClient");
  try {
    var query = {};
    if (req.body.user_name) {
      query.user_name = req.body.user_name;
    } else {
      query.user_id = req.body.user_id;
    }
    const checkClient = await Client.findOne(query);
    if (checkClient == null) {
      return res.status(404).json({
        message: "User Not Found",
        status: 0
      });
    }
    checkClient.remove();
    var message = "Client removed successfully";
    return responseHelper.success(res, query, message);
  } catch (err) {
    responseHelper.requestfailure(res, err);
  }
};

module.exports = {
  AS,
  createClient,
  getClient,
  updateClient,
  removeClient,
  getClientById,
};