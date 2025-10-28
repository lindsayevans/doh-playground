/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { render, screen } from "../test-utils";

import { App } from "./App";

describe("App component", () => {
  test("displays heading", async () => {
    render(<App />);

    const heading = screen.getByText(/^Welcome to/, { selector: "h2" });

    expect(heading).toHaveTextContent("Welcome to DoH Playground!");
  });

  test("displays config", async () => {
    render(<App config={{ foo: "test" }} />);

    await screen.findByRole("code");

    expect(screen.getByRole("code")).toHaveTextContent('"foo": "test"');
  });
});
