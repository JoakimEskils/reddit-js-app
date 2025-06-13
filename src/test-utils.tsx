import { render as rtlRender } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";

// Mock the Next.js router and search params
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
    query: {},
  }),
  useSearchParams: () => new URLSearchParams("limit=10"),
}));

// Create a custom render function that includes the router mock
export function render(ui: React.ReactElement) {
  return rtlRender(ui);
}

export * from "@testing-library/react"; 