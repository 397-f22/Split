import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */  

describe('deadline', () => {
  it('Given modal popped up and attendee user, deadline should display', async () => {
    const mockUser = {
      uid: "testUser2",
      displayName: "Test User 2",
      email: "testuser2@gmail.com",
    };
    mockFirebase(mockUser);
    render(<App />);
    fireEvent.click(screen.getByText(/Event Details/i));
    const deadline = mockData.events.testEvent.deadline;
    const content = "Deadline: " + new Date(deadline).toLocaleString()
    await screen.findByText(content);
  })
  it('Given modal popped up and organizer user, date picker should display', async () => {
    const mockUser = {
      uid: "testUser1",
      displayName: "Test User 1",
      email: "testuser1@gmail.com",
    };
    mockFirebase(mockUser);
    render(<App />);
    fireEvent.click(screen.getByText(/Event Details/i));
    await screen.findByText(/Pick a time/i);
  })
}); 