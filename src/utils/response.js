
const responseObject = (code = 200, body) => (
  {
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json'
    },
    statusCode: code,
    body: JSON.stringify(body)
  });

module.exports = { responseObject }