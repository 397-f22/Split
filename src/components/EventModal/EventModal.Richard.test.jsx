import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */
describe('Given modal popped up', () => {
    it('Payments should display and user should be able to change them to desired amount', async () => {
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
        const paymentInput = window.document.querySelector('.payment-amount-testUser2');
        expect(paymentInput.getAttribute('placeholder').valueOf()).toBe('30')
        fireEvent.change(paymentInput, { target: { value: "40" } });
        expect(mockData.events.testEvent.payments[1].amount).toBe('40')
    });
});