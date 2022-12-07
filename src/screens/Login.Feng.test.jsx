import React from 'react'
import '@testing-library/jest-dom'

import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { mockFirebase } from '../helpers';

// mock firebase
vi.mock('../utilities/firebase')
/**
 * @jest-environment jsdom
 */
describe('Given user is not logged in', () => {
  it('We should be redirected to the login page', async () => {    
    // mock firebase
    mockFirebase();
    render(<App />)
    expect(await screen.getByText(/SIGN IN NOW/i)).toBeInTheDocument()
  });
});