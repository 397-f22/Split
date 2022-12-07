import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */
describe('Given modal popped up', () => {
    it('When clicking "close", the modal closes', async () => {
        const mockUser = {
            uid: "testUser1",
            displayName: "Test User 1",
            email: "testuser1@gmail.com",
        };
        // mock firebase
        mockFirebase(mockUser);
        render(<App />);
        // click on the event details button
        fireEvent.click(screen.getByText(/Event Details/i));
        fireEvent.click(screen.getByText(/Close/i));
        expect(!(await screen.findByText(/Delete Event/i)))
    });
});