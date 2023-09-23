'use strict';

const { dynamodb } = require("../../utils/dynamodb");

const { responseObject } = require('../../utils/response');

module.exports.find = async (event) => {
  try {
    const idplaneta = event.pathParameters.idplaneta;

    const params = {
      TableName: process.env.PLANET_TABLE,
      Key: {
        idplaneta: idplaneta,
      },
    };

    console.log('DynamoDB Params:', params);

    const result = await dynamodb.get(params).promise();
    console.log('DynamoDB Result:', result);

    if (!result.Item) {
      return responseObject(404, { message: `No planet found with id: ${idplaneta}` });
    }

    return responseObject(200, result.Item);
  } catch (error) {
    console.error('Error fetching planet:', error);
    return responseObject(500, { message: 'Internal Server Error' });
  }
};