import { render, screen } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'

import { describe, it, vi } from 'vitest';
import { App } from '../App';
import { mockFirebase } from '../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */
describe('Given user is not logged in', () => {
  it('We should be redirected to the login page', async () => {
    const mockUser = {
      uid: "testUser1",
      displayName: "Test User 1",
      email: "testuser1@gmail.com",
    };
    // mock firebase
    mockFirebase(mockUser);
    render(<App />, { wrapper: BrowserRouter })
    fireEvent.click(screen.getByText(/Sign out/i));
    expect(await screen.getByText(/SIGN IN NOW/i)).toBeInTheDocument()
  });
});