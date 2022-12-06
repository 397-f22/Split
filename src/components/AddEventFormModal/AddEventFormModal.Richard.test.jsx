import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')

/**
 * @jest-environment jsdom
 */
describe('Given homepage', () => {
    it('When the user clicks on on the plus button, the add event modal opens', async () => {
        const mockUser = {
            uid: "testUser1",
            displayName: "Test User 1",
            email: "testuser1@gmail.com",
        };
        // mock firebase
        mockFirebase(mockUser);
        render(<App />);
        // click on the add event button
        const addEventButton = window.document.querySelector('.bi-plus-circle');
        fireEvent.click(addEventButton);
        expect(await screen.findByText(/Create A New Event/i));
    });
});