import React, { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

import * as config from '../config';

interface Query {
  address: string;
}
export const Root: React.FC<{ query: Query }> = ({ query }) => {
  // const [value, setValue] = useState(null);

  // console.log(value);
  return (
    <div>
      <h1>Test</h1>
      <Autocomplete
        apiKey={config.GOOGLE_API_KEY}
        onPlaceSelected={(place) => console.log(place)}
      />{' '}
    </div>
  );
};
