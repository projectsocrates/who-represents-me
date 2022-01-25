import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from '../client/Root/Root';

ReactDOM.hydrate(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
