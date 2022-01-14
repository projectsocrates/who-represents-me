import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import * as config from './config';
import { Root } from './client/root';

let app = express();
const port = process.env.PORT || 3000;

const pageTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="description"
      content="SSR result"
    />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
const renderPage = (reactComponent) => {
  const renderedComponent = ReactDOMServer.renderToString(reactComponent);
  return pageTemplate.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedComponent}</div>`
  );
};

app.get('/*', (req, res) => res.send(renderPage(<Root query={req.query} />)));

app.get('/representatives', async (req, res) => {
  console.log(req.query);
  res.send(200);
  // http.get(`https://www.googleapis.com/civicinfo/v2/representatives?key=${GOOGLE_API_KEY}`)
});

app.listen(port);
