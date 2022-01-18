import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import * as config from '../config';
import { Root } from '../client/root';
import axios from 'axios';
import {
  GoogleRepresentativesResponse,
  RepresentativesResult,
  transformGoogleCivicInfo,
} from '../entities/representatives';

let app = express();

const port = process.env.PORT || 3000;

if (!config.GOOGLE_API_KEY) {
  Array({ length: 3 })
    .fill('ERROR: Must Specify GOOGLE_API_KEY')
    .forEach((s) => console.error(s));
  process.exit(1);
}

app.get('/', (req, res) => {
  const app = ReactDOMServer.renderToString(<Root />);

  const html = `
      <html lang="en">
      <head>
          <link rel="stylesheet" href="dom.css" />
          <script src="dom.js" async defer></script>
      </head>
      <body>
          <div id="root">${app}</div>
          <script>
            window.__CONFIG__ = {
              GOOGLE_API_KEY: "${config.GOOGLE_API_KEY}"
            }
          </script>
      </body>
      </html>
  `;
  res.send(html);
});

app.use(express.static('./built'));

app.get('/representatives', async (req, res) => {
  console.log(req.query);
  const results = await axios.get<GoogleRepresentativesResponse>(
    `https://www.googleapis.com/civicinfo/v2/representatives`,
    {
      params: {
        key: config.GOOGLE_API_KEY,
        address: req.query.formattedAddress,
      },
    }
  );

  const response = transformGoogleCivicInfo(results.data);
  res.json(response);
});

app.listen(port);
