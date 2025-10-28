import React from "react";

import { Container, createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "cyan",
});

import { Config } from "./Config";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";

export type AppProps = { config?: Config };

export const App: React.FC<AppProps> = (props) => {
  const { config } = props;

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Container size="lg">
        <h2>Welcome to DoH Playground!</h2>

        <h3>Config</h3>
        {config && <pre role="code">{JSON.stringify(config, null, 2)}</pre>}

        <h3>Toggle theme</h3>
        <ThemeToggle />
      </Container>
    </MantineProvider>
  );
};
