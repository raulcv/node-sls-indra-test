const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockDynamoDBResponse = {
  Items: [
    {
      idplaneta: '1',
      nombre: 'Planet 1',
      terreno: 'Terrain 1'
    },
    {
      idplaneta: '2',
      nombre: 'Planet 2',
      terreno: 'Terrain 2'
    }
  ]
};

const mockDynamoDB = {
  scan: sinon.stub().returns({
    promise: sinon.stub().resolves(mockDynamoDBResponse)
  })
};

const mockResponseObject = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

const handler = proxyquire('../src/planet/01-get/handler.js', {
  '../../utils/dynamodb': { dynamodb: mockDynamoDB },
  '../../utils/response': { responseObject: mockResponseObject }
});

describe('get handler', () => {
  it('should fetch planets based on query parameters', async () => {
    const event = {
      queryStringParameters: {
        nombre: 'Planet',
        terreno: 'Terrain',
        limite: '10',
        page: 'pageKey'
      }
    };

    const expectedParams = {
      TableName: process.env.PLANET_TABLE,
      Limit: 10,
      FilterExpression: 'contains(nombre, :nombre) AND contains(terreno, :terreno)',
      ExpressionAttributeValues: {
        ':nombre': 'Planet',
        ':terreno': 'Terrain'
      },
      ExclusiveStartKey: { idplaneta: 'pageKey' }
    };

    const result = await handler.get(event);

    // Assert the DynamoDB scan function was called with the correct parameters
    expect(mockDynamoDB.scan.calledWith(expectedParams)).to.be.true;

    // Assert the result from the handler
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');

    const parsedResult = JSON.parse(result.body);
    expect(parsedResult.data).to.deep.equal(mockDynamoDBResponse.Items);
    expect(parsedResult.count).to.equal(mockDynamoDBResponse.Items.length);
    expect(parsedResult.nextPage).to.equal(null);
  });
});
