//import mongoose and models
var mongoose = require('mongoose');
var Client = mongoose.model('Client');
var mongoDotNotation = require('mongo-dot-notation');
//import randomatic to create unique user character code
var randomize = require('randomatic');

//Lodash for data manipulation
const _ = require('lodash');

//bluebird for promises
const promise = require('bluebird');

//helper functions
const constants = require("../hardCodedData").constants;
module.exports = {
};
