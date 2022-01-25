import React, { useState } from 'react';
import './root.css';
import { AddressLookup } from '../AddressLookup/AddressLookup';
import { Representatives } from '../Representatives/Representatives';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { Instructions } from '../Instructions/Instructions';

export const Root: React.FC = () => {
  const [value, setValue] = useState(null);

  return (
    <AppContext>
      <AddressLookup
        onPlaceSelected={(value) => {
          setValue(value.formatted_address);
        }}
      />
      <Container display="flex" flex="auto" padding="0" width="100%">
        {value ? (
          <Representatives formattedAddress={value} />
        ) : (
          <Instructions />
        )}
      </Container>
    </AppContext>
  );
};

export const AppContext: React.FC = ({ children }) => {
  return (
    <ChakraProvider>
      <Container
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        flexDirection="column"
        padding="0"
      >
        {children}
      </Container>
    </ChakraProvider>
  );
};
