
var https = require('follow-redirects').https;

function fetchdata(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { fetchdata }