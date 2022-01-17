import React from 'react';
import Autocomplete, {
  ReactGoogleAutocompleteProps,
} from 'react-google-autocomplete';
import * as config from '../../config';
import './AddressLookup.css';

export const AddressLookup: React.FC<{
  onPlaceSelected: ReactGoogleAutocompleteProps['onPlaceSelected'];
}> = ({ onPlaceSelected }) => {
  return (
    <Autocomplete
      options={{ types: ['address'] }}
      apiKey={config.GOOGLE_API_KEY}
      onPlaceSelected={onPlaceSelected}
    />
  );
};
