const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper function to get the content type based on file extension
const getContentType = (filePath) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
};

// Function to handle serving static files
const serveStaticFile = (res, filePath, contentType, responseCode = 200) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Internal Error');
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      serveStaticFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
    } else if (req.url === '/about.html') {
      serveStaticFile(res, path.join(__dirname, 'public', 'about.html'), 'text/html');
    } else {
      let filePath = path.join(__dirname, 'public', req.url);
      let contentType = getContentType(filePath);
      fs.exists(filePath, (exists) => {
        if (!exists) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Not Found');
          return;
        }
        serveStaticFile(res, filePath, contentType);
      });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
