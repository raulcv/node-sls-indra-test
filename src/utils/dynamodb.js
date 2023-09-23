const AWS = require('aws-sdk');

const dynamoDBClientParams = process.env.IS_OFFLINE
  ? {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: "",
    secretAccessKey: "",
  }
  : {};
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoDBClientParams);

module.exports = { dynamodb }