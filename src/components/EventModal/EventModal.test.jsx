import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */

// When the user clicks on an event detail button, the event details are displayed in a modal.
describe('event details button works?', () => {
  // check if the modal is opened => Roger
  // deadline is displayed => Shalini
  // attendees are displayed => Camilo
  // description is displayed => Ping
  it('Given modal poped up and attendee user, deadline should display', async () => {
    const mockUser = {
      uid: "testUser2",
      displayName: "Test User 2",
      email: "testuser2@gmail.com",
    };
    // mock firebase
    mockFirebase(mockUser);
    render(<App />);
    // click on the event details button
    fireEvent.click(screen.getByText(/Event Details/i));
    const deadline = mockData.events.testEvent.deadline;
    const content = "Deadline: " + new Date(deadline).toLocaleString()
    await screen.findByText(content);
  })
  it('Given modal poped up and organizer user, date picker should display', async () => {
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
    await screen.findByText(/Pick a time/i);
  })
}); 