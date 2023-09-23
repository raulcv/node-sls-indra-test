const { responseObject } = require("../utils/response");

module.exports.greet = async (event) => {
  return responseObject(200,
    {
      message: "Hello my dear. Welcome!!! Please look out the project made with serverless framework. made by raulcv.com!",
      input: event
    })
};
