const { expect } = require('chai');
const lambdaTester = require('lambda-tester');
const proxyquire = require('proxyquire');
const Sinon = require('sinon');

const mockResponseObject = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

// Mock planet data
const mockPlanet = {
  "diametro": "12500",
  "peliculas": ["https://swapi.py4e.com/api/films/5/"],
  "nombre": "Alderaan",
  "periodo_rotacion": "24",
  "url": "https://swapi.py4e.com/api/planets/2/",
  "residentes": ["https://swapi.py4e.com/api/people/8/"],
  "clima": "temperate",
  "gravedad": "1 standard",
  "creado": "2014-12-10T11:35:48.479000Z",
  "editado": "2014-12-20T20:58:18.420000Z",
  "superficie_agua": "40",
  "idplaneta": "506fb5be-70cb-483a-ac66-e89d1a1ef56b",
  "periodo_orbital": "364",
  "id": 2,
  "poblacion": "2000000000",
  "terreno": "grasslands, mountains"
};

// Mock DynamoDB response
const dynamoDBResponse = {
  Item: mockPlanet,
  $response: {
    httpResponse: {
      statusCode: 200
    }
  }
};
const mockDynamoDB = {
  get: Sinon.stub().returns({
    promise: Sinon.stub().resolves(dynamoDBResponse)
  })
};


describe('find planet by id handler', () => {
  it('should fetch a planet by id', () => {
    const event = {
      pathParameters: {
        idplaneta: '506fb5be-70cb-483a-ac66-e89d1a1ef56b'  // Using the provided idplaneta
      }
    };

    // Override the dynamodb object with the mock
    const handlerWithMock = proxyquire('../src/planet/00-find/handler', {
      '../../utils/dynamodb': { dynamodb: mockDynamoDB },
      '../../utils/response': { responseObject: mockResponseObject }
    });

    return lambdaTester(handlerWithMock.find)
      .event(event)
      .expectResult((result) => {
        console.log("result: ", result)
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.a('string');
        const responseBody = JSON.parse(result.body);
        expect(responseBody).to.deep.equal(mockPlanet);
      });
  });
});
