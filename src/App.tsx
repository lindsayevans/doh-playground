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
import { IconBrandGithub } from '@tabler/icons-react';

export const App: React.FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <header>
        <h1>DNS over HTTPS</h1>
        <a href="https://github.com/lindsayevans/doh-playground">
          <IconBrandGithub size={32} color="#fff" />
        </a>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<DoH />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};
