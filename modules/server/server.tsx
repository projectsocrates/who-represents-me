import { dom as fontAwesomeDom } from '@fortawesome/fontawesome-svg-core';
import result from 'await-result';
import axios from 'axios';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getLocale } from '../client/Bills/Bills';
import { Root } from '../client/Root/Root';
import * as config from '../config';
import { Bills, Locales } from '../entities/bills';
import {
  GoogleRepresentativesResponse,
  transformGoogleCivicInfo,
} from '../entities/representatives';
import { getChicagoBills } from './chicago-bills';

let app = express();

const port = process.env.PORT || 3000;

if (!config.GOOGLE_API_KEY) {
  Array({ length: 3 })
    .fill(
      'ERROR: Must Specify GOOGLE_API_KEY. In GitHub, set secret in CodeSpaces. In Heroku, set secret in Heroku settings.'
    )
    .forEach((s) => console.error(s));
  process.exit(1);
}

app.get('/', async (req, res) => {
  let app: string;
  const formattedAddressParam = req.query[
    config.FORMATTED_ADDRESS_SEARCH_KEY
  ] as string;
  const repLevel = req.query[config.REP_LEVEL_SEARCH_KEY] as string;
  if (formattedAddressParam) {
    // reps
    const [err, representatives] = await result(
      getRepresentatives(formattedAddressParam)
    );

    // bills
    const locale = getLocale(formattedAddressParam);
    let bills: Bills[] = [];
    let billErr;
    if (locale && repLevel === 'city') {
      const res = await result(getBills(locale));
      bills = res[1];
      billErr = res[0];
    }

    // errors
    if (err || billErr) {
      app = ReactDOMServer.renderToString(<Root />);
    } else {
      app = ReactDOMServer.renderToString(
        <Root
          defaultFormattedAddress={formattedAddressParam}
          representatives={representatives}
          bills={bills}
          defaultRepLevel={repLevel}
        />
      );
    }
  } else {
    app = ReactDOMServer.renderToString(<Root />);
  }

  const html = `
      <html lang="en">
      <head>
          <link rel="stylesheet" href="dom.css" />
          <script src="dom.js" async defer></script>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style type="text/css">${fontAwesomeDom.css()}</style>
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
  const [err, response] = await result(
    getRepresentatives(req.query.formattedAddress as string)
  );
  if (err) {
    res.status(500).send(err);
  }
  res.json(response);
});

app.get('/bills', async (req, res) => {
  const [err, response] = await result(getBills(req.query.locale as Locales));
  if (err) {
    res.status(500).send(err);
  }
  res.json(response);
});

const getBills = async (locale: Locales): Promise<Bills[]> => {
  console.log('gettings bills for', locale);
  let cityData: Bills[] = [];
  switch (locale) {
    case 'Chicago':
      cityData = await getChicagoBills();
      break;
    default:
      cityData = [];
      break;
  }
  return cityData;
};

const getRepresentatives = async (address: string) => {
  console.log('searching for representatives for', address);
  try {
    const results = await axios.get<GoogleRepresentativesResponse>(
      `https://www.googleapis.com/civicinfo/v2/representatives`,
      {
        params: {
          key: config.GOOGLE_API_KEY,
          address: address,
        },
      }
    );

    const response = transformGoogleCivicInfo(results.data);
    return response;
  } catch (e) {
    throw e;
  }
};

app.listen(port);
