import { ChakraProvider, Flex } from '@chakra-ui/react';
import React from 'react';
import { FORMATTED_ADDRESS_SEARCH_KEY } from '../../config';
import { Bills } from '../../entities/bills';
import { RepresentativesResult } from '../../entities/representatives';
import { AddressLookup } from '../AddressLookup/AddressLookup';
import { Instructions } from '../Instructions/Instructions';
import { Representatives } from '../Representatives/Representatives';
import { useSearchParam } from '../Utils/useLocation';
import './Root.css';

export const Root: React.FC<{
  representatives?: RepresentativesResult;
  bills?: Bills[];
  defaultFormattedAddress?: string;
  defaultRepLevel?: string;
}> = ({ representatives, defaultFormattedAddress, defaultRepLevel, bills }) => {
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
      <Flex flex="auto" padding="0" width="100%">
        {formattedAddress || representatives ? (
          <>
            <Representatives
              representatives={representatives}
              bills={bills}
              formattedAddress={formattedAddress}
              defaultRepLevel={defaultRepLevel}
            />
          </>
        ) : (
          <Instructions />
        )}
      </Flex>
    </AppContext>
  );
};

export const AppContext: React.FC = ({ children }) => {
  return (
    <ChakraProvider>
      <Flex
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        flexDirection="column"
        padding="0"
      >
        {children}
      </Flex>
    </ChakraProvider>
  );
};
