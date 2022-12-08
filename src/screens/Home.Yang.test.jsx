import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { mockData, mockFirebase } from '../helpers';
import '@testing-library/jest-dom'

// mock firebase
vi.mock('../utilities/firebase')
/**
 * @jest-environment jsdom
 */

describe('Given a user is signed in', () => {
    it('When a user visits the webiste, then they are redirected to the homepage', async () => {
        const mockUser = {
            uid: "testUser1",
            displayName: "Test User 1",
            email: "testuser1@gmail.com",
        };
        // mock firebase
        mockFirebase(mockUser);
        render(<App />);
        
        // the title and the welcome message should be there
        expect(await screen.findByText(/Split/i));
        expect(await screen.findByText(/Welcome! Test User 1/i));
    })
})