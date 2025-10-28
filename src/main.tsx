import React, { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { App } from "./App";

const $apps = document.querySelectorAll<HTMLElement>(".app");
$apps.forEach(($app) => {
  const root = createRoot($app);
  const config = $app.dataset.config
    ? JSON.parse($app.dataset.config)
    : undefined;

  root.render(
    <StrictMode>
      <App config={config} />
    </StrictMode>,
  );
});
