import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * @jest-environment jsdom
 */
describe('launching', () => {
  it('does app start?', () => {
    render(<App />);
  })
});
