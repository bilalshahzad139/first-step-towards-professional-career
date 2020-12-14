const { v4: uuidv4 } = require('uuid');
const http = require('http');

const requestListener = function (req, res) {
  res.writeHead(200);
  var uid = uuidv4();
  res.end('Hello, World! - ' + uid);
}

const server = http.createServer(requestListener);
server.listen(8080);