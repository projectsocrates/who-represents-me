import { Container, Flex } from '@chakra-ui/react';
import React from 'react';
import Autocomplete, {
  ReactGoogleAutocompleteProps,
} from 'react-google-autocomplete';
import * as config from '../../config';
import './AddressLookup.css';

export const AddressLookup: React.FC<{
  onPlaceSelected: ReactGoogleAutocompleteProps['onPlaceSelected'];
  defaultValue?: string;
}> = ({ onPlaceSelected, defaultValue }) => {
  return (
    <Flex
      textAlign="center"
      width="100%"
      background="#416cbb"
      padding="0"
      className="address-lookup-container"
    >
      <Autocomplete
        options={{ types: ['address'] }}
        apiKey={config.GOOGLE_API_KEY}
        onPlaceSelected={onPlaceSelected}
        placeholder="Type In Your Address Here..."
        defaultValue={defaultValue}
      />
    </Flex>
  );
};
