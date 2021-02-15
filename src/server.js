const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/success': jsonHandler.getSuccess, // 200
  '/badRequest': jsonHandler.getBadRequest, // 400 OR 200
  '/unauthorized': jsonHandler.getUnauthorized, // 401 OR 200
  '/forbidden': jsonHandler.getForbidden, // 403
  '/internal': jsonHandler.getInternalError, // 500
  '/notImplemented': jsonHandler.getNotImplemented, // 501
  '/notFound': jsonHandler.getNotFound, // 404
  notFound: jsonHandler.getNotFound,
  index: htmlHandler.getIndex,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  const acceptedTypes = request.headers.accept.split(',');

  console.log(`Requested URL: ${parsedUrl.pathname}`);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params, acceptedTypes);
  } else {
    urlStruct.index(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
