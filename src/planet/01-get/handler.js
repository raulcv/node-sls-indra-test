'use strict';

const { dynamodb } = require("../../utils/dynamodb");

const { responseObject } = require('../../utils/response')

module.exports.get = async (event) => {
  const { nombre, terreno, limite, page } = { ...event.queryStringParameters }
  const items = [];
  let limitPerPage = parseInt(limite) === NaN ? 2: parseInt(limite);
  let pagekey = page == undefined ? '' : page
  
  let params = {
    TableName: process.env.PLANET_TABLE,
    Limit: limitPerPage,
  };

  if (nombre) {
    params.FilterExpression = 'contains(nombre, :nombre)';
    params.ExpressionAttributeValues = { ':nombre': nombre };
  }

  if (terreno) {
    if (params.FilterExpression) {
      params.FilterExpression += ' AND contains(terreno, :terreno)';
    } else {
      params.FilterExpression = 'contains(terreno, :terreno)';
    }
    if (nombre) {
      params.ExpressionAttributeValues = { ':nombre': nombre, ':terreno': terreno }
    } else params.ExpressionAttributeValues = { ':terreno': terreno }
  }
  if (pagekey) {
    params.ExclusiveStartKey = JSON.parse(decodeURIComponent(JSON.stringify({ idplaneta: pagekey })));
  }
  console.log(params)
  const recursiveProcess = async (params) => {
    const { Items = [], LastEvaluatedKey } = await dynamodb.scan(params).promise()
    items.push(...Items)
    // console.log(...Items)
    if (LastEvaluatedKey && items.length < limitPerPage) {
      params.ExclusiveStartKey = LastEvaluatedKey;
      await recursiveProcess(params);
    }
  }
  await recursiveProcess(params)
  return responseObject(200, 
    {
      data: items, count: items.length, 
      nextPage:  items.length === limitPerPage ? encodeURIComponent(JSON.stringify(params.ExclusiveStartKey)) : null
    })
}