/**
 * Created by Mb
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Float = require("mongoose-float").loadType(mongoose, 2);
const constants = require("../hardCodedData").constants;
mongoose.set("debug", true);
clientsSchema = new Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    user_name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    logo: {
      type: String,
    },
    tag_line: {
      type: String,
    },
    banner: {
      type: String,
    },
    template_number: {
      type: String,
    },
    primary_color: {
      type: String,
    },
    secondary_color: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Client", clientsSchema);
