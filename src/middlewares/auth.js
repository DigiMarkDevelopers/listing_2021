var mongoose = require("mongoose");
var ApiKeys = mongoose.model("ApiKeys");
module.exports.authenticate = (req, res, next) => {
  var authorization = req.header("Authorization");

  if (authorization) {
    var token = authorization.split(" ");
    ApiKeys.findOne({ key: token[1] }, function (err, key) {
      if (err) {
        return res.json({
          status: "Fail",
          systemfailure: false,
          message: "Failed to validate api key.",
          jsonerr: { message: "Failed to validate api key." },
        });
      } else {
        if (key == null) {
          return res.status(401).json({
            status: "Fail",
            systemfailure: false,
            message: " Invalid API KEY  .",
            jsonerr: { message: "Invalid API KEY." },
          });
        }
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: "Fail",
      systemfailure: false,
      message: "No api key provided.",
      jsonerr: { message: "No api key provided." },
    });
  }
};
