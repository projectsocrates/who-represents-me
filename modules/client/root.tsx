import React, { useState } from 'react';
import './root.css';
import { AddressLookup } from './AddressLookup/AddressLookup';
import { Representatives } from './Representatives/Representatives';

export const Root: React.FC = () => {
  const [value, setValue] = useState(null);

  return (
    <>
      <AddressLookup
        onPlaceSelected={(value) => {
          setValue(value.formatted_address);
        }}
      />
      {value && <Representatives formattedAddress={value} />}
    </>
  );
};
