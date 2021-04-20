const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApiKeysSchema = new Schema(
  {
    key: {
      type: String
    }
  },{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);


const ApiKeysModel = mongoose.model("ApiKeys", ApiKeysSchema);

module.exports = ApiKeysModel;
