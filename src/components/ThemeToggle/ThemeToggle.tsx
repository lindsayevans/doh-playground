import React from "react";
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import cx from "clsx";

import { CloudSun, CloudMoon } from "react-bootstrap-icons";

const baseClass = "theme-toggle";

import "./ThemeToggle.scss";

export const ThemeToggle: React.FC = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      className={baseClass}
    >
      <CloudSun
        className={cx(`${baseClass}__icon`, `${baseClass}__icon--light`)}
      />
      <CloudMoon
        className={cx(`${baseClass}__icon`, `${baseClass}__icon--dark`)}
      />
    </ActionIcon>
  );
};
