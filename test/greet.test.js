const { expect } = require('chai');
const lambdaTester = require('lambda-tester');
const { greet } = require('../src/greet/handler');

describe('greet handler', () => {
  it('should respond with a greeting message', () => {
    const event = {};

    return lambdaTester(greet)
      .event(event)
      .expectResult((result) => {
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.a('string');

        const responseBody = JSON.parse(result.body);
        expect(responseBody).to.have.property('message');
        expect(responseBody.message).to.equal('Hello my dear. Welcome!!! Please look out the project made with serverless framework. made by raulcv.com!');
      });
  });
});
