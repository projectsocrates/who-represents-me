import React, { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import * as config from '../config';
import './root.css';

interface Query {
  address: string;
}
export const Root: React.FC<{ query: Query }> = ({ query }) => {
  const [value, setValue] = useState(null);

  return (
    <>
      <Autocomplete
        options={{ types: ['address'] }}
        apiKey={config.GOOGLE_API_KEY}
        onPlaceSelected={(value) => setValue(value.formatted_address)}
      />
      {value && <Representatives formatted_address={value} />}
    </>
  );
};

const Representatives: React.FC<{ formatted_address: string }> = ({
  formatted_address,
}) => {
  console.log(formatted_address);
  return <></>;
};
