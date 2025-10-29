import React, { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { App } from './App';

const $apps = document.querySelectorAll<HTMLElement>('.app');
$apps.forEach(($app) => {
  const root = createRoot($app);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
