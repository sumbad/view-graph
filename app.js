const http = require('http');
const fs = require('fs');

const HOSTNAME = '127.0.0.1';
const PORT = 8081;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  console.log(req.url);
  

  let filePath = '';

  switch (req.url) {
    case '/':
      filePath = `${BASE_DIR}/index.html`;
      break;
    default:
      filePath = `${BASE_DIR}${req.url}`;
      break;
  }

  if (fs.existsSync(filePath)) {
    res.statusCode = 200;
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
