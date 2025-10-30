import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { createTheme, MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import 'mantine-datatable/styles.css';

const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'cyan',
});

import { DoH } from './components/DoH';

export const App: React.FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<DoH />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};
