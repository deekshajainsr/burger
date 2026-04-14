import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App.tsx';
import './index.css';

const cache = createCache({
  key: 'css',
  prepend: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
