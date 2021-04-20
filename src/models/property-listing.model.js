const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Float = require("mongoose-float").loadType(mongoose, 2);

const propertyListingSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Client",
    },
    user_id: {
      type: String,
      required: true,
    },
    property_id: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    main_image: {
      type: String,
    },
    category: {
      type: String,
    },
    parking: {
      type: String,
    },
    //
    price: {
      type: Number,
    },
    rehab_need: {
      type: String,
    },
    purchase_costs: {
      type: String,
    },
    after_repair_value: {
      type: String,
    },
    potential_profit: {
      type: String,
    },
    //
    year_of_build: {
      type: String,
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    square_ft: {
      type: Number,
    },
    lot_size: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Available", "Pending", "Sold"],
    },
    //GeoJSON: coordinates data must be in longitude then latitude order as supported by GeoJSON
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
      },
    },
    images: [String],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const propertyListingModel = mongoose.model(
  "PropertyListing",
  propertyListingSchema
);

module.exports = propertyListingModel;
