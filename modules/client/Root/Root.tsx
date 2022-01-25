import React, { useState } from 'react';
import './Root.css';
import { AddressLookup } from '../AddressLookup/AddressLookup';
import { Representatives } from '../Representatives/Representatives';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { Instructions } from '../Instructions/Instructions';
import { useLocation } from '../Utils/useLocation';
import { FORMATTED_ADDRESS_SEARCH_KEY } from '../../config';
import { RepresentativesResult } from '../../entities/representatives';

const useFormattedAddress = (
  defaultFormattedAddress?: string
): [string, (formatted_address: string) => void] => {
  const { params, push } = useLocation();

  const setFormattedAddress = (formatted_address: string) => {
    push({
      searchParams: [[FORMATTED_ADDRESS_SEARCH_KEY, formatted_address]],
    });
  };

  const formattedAddress =
    params[FORMATTED_ADDRESS_SEARCH_KEY] || defaultFormattedAddress;

  return [formattedAddress, setFormattedAddress];
};

export const Root: React.FC<{
  representatives?: RepresentativesResult;
  defaultFormattedAddress?: string;
}> = ({ representatives, defaultFormattedAddress }) => {
  const [formattedAddress, setFormattedAddress] = useFormattedAddress(
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
