import { ChakraProvider, Container } from '@chakra-ui/react';
import React from 'react';
import { FORMATTED_ADDRESS_SEARCH_KEY } from '../../config';
import { RepresentativesResult } from '../../entities/representatives';
import { AddressLookup } from '../AddressLookup/AddressLookup';
import { Instructions } from '../Instructions/Instructions';
import { Representatives } from '../Representatives/Representatives';
import { useSearchParam } from '../Utils/useLocation';
import './Root.css';

export const Root: React.FC<{
  representatives?: RepresentativesResult;
  defaultFormattedAddress?: string;
  defaultRepLevel?: string;
}> = ({ representatives, defaultFormattedAddress, defaultRepLevel }) => {
  const [formattedAddress, setFormattedAddress] = useSearchParam(
    FORMATTED_ADDRESS_SEARCH_KEY,
    defaultFormattedAddress
  );

  return (
    <AppContext>
      <AddressLookup
        defaultValue={formattedAddress}
        onPlaceSelected={(value) => {
          setFormattedAddress(value.formatted_address);
        }}
      />
      <Container display="flex" flex="auto" padding="0" width="100%">
        {formattedAddress || representatives ? (
          <Representatives
            representatives={representatives}
            formattedAddress={formattedAddress}
            defaultRepLevel={defaultRepLevel}
          />
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
