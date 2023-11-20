# Serverless Framework Node HTTP API on AWS
This is a complete full functional HTTP API build with NodeJS, DynamoDB to store data and Serverless Framework V3, this project runs on AWS Cloud Using AWS Lambda, API Gateway, Layers and more.

## Usage

### Deployment

```
$ npm install
```

Create a layer ofr node_module dependencies

```
$ npm run build
```

Deploy on AWS with serverless.yml file

```
$ npm run deploy
```

or

```
$ sls deploy
```

After deploying, you should see output similar to:

```bash
Deploying node-sls-indra-test to stage dev (us-east-1)

✔ Service deployed to stack node-sls-indra-test-dev (105s)

endpoints:
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/planet/{idplaneta}
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/planet
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/planet
functions:
  greet: node-sls-indra-test-dev-greet (175 kB)
  find-planet: node-sls-indra-test-dev-find-planet (176 kB)
  ....
layers:
  nodemodules: arn:aws:lambda:us-east-1:xxxxxxxxxx:layer:nodemodules:1
```

### Call the Endpoints

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

```json
{
    "message": "Hello my dear. Welcome!!! Please look out the project made with serverless framework. made by raulcv.com!",
    "input": {
        "version": "2.0",
        "routeKey": "GET /",
        "rawPath": "/"
        ...
```

### Locally

You can invoke the functions locally by using the following command:

```bash
serverless invoke local --function greet
```

the response will be similar to:

```
{
    "statusCode": 200,
    "body": {
        "message": "Hello my dear. Welcome!!! Please look out the project made with serverless framework. made by raulcv.com!",
        "input": ""
    }
}
```
Awesome Works!!! 😇😇😇


Emulate API Gateway and Lambda locally using `serverless offline` plugin.

```bash
npm run dev
```

### Unit Testing

Run Unit testing locally

```bash
npm test
```

### Functional testing with Postman

Import into postamn included JSON file serverless.postman_collection.json