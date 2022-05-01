import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import
{
  ChakraProvider,
} from '@chakra-ui/react';
import Routes from './routes/index'
import theme from './theme/theme'

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <StrictMode>
      <Routes />
    </StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
