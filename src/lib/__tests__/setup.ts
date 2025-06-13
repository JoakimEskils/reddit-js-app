import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import React from 'react';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock fetch
global.fetch = jest.fn();

// Mock response helper
export const mockFetchResponse = (data: any) => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
};

// Mock error response helper
export const mockFetchError = (error: Error) => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.reject(error)
  );
};

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  },
}));

export {}; 