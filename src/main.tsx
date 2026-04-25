import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { router } from './router';
import { StoreProvider } from './app/providers/StoreProvider';
import { Toaster } from './components/ui/toaster/toaster';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <ChakraProvider value={defaultSystem}>
        <RouterProvider router={router} />
        <Toaster />
      </ChakraProvider>
    </StoreProvider>
  </React.StrictMode>,
);
