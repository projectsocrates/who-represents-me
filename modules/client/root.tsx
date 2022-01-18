import React, { useState } from 'react';
import './root.css';
import { AddressLookup } from './AddressLookup/AddressLookup';
import { Representatives } from './Representatives/Representatives';
import { ChakraProvider } from '@chakra-ui/react';

export const Root: React.FC = () => {
  const [value, setValue] = useState(null);

  return (
    <ChakraProvider>
      <AddressLookup
        onPlaceSelected={(value) => {
          setValue(value.formatted_address);
        }}
      />
      {value && <Representatives formattedAddress={value} />}
    </ChakraProvider>
  );
};
