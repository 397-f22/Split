import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */

describe('Given a homepage with an event', () => {
    it('When clicking "event details", if the user is the organizer, there is a delete AND a close button', async () => {
        const mockUser = {
            uid: "testUser1",
            displayName: "Test User 1",
            email: "testuser1@gmail.com",
        };
        // mock firebase
        mockFirebase(mockUser);
        render(<App />);
        // click on event detail
        fireEvent.click(screen.getByText(/Event Details/i));
        // delete AND close button
        expect((await screen.findByText(/Delete Event/i)) && (await screen.findByText(/Close/i)));
    })

    it('When clicking "event details", if the user is an attendee, there is ONLY a close button', async () => {
        const mockUser = {
            uid: "testUser2",
            displayName: "Test User 2",
            email: "testuser2@gmail.com",
          };
        // mock firebase
        mockFirebase(mockUser);
        render(<App />);
        // click on event detail
        fireEvent.click(screen.getByText(/Event Details/i));
        // close button
        await screen.findByText(/Close/i);
        // NO delete button
        const del = screen.queryByText(/Delete Event/i);
        expect(del).toBeNull();
    })
})