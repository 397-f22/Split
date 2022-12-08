import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';
import EventCard from '../EventCard/EventCard';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */
// Given add event modal is open, when the user clicks the save button, the event is added to the database.

describe('Add event form saves correct attendees and deadline?', () => {
  it('Given add event modal is open, when the user clicks the save button, the event is added to the database', async () => {
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
    // fill in the form
    const time = window.document.querySelector('#deadline');
    const titleInput = screen.getByPlaceholderText(/Event Title/i);
    const descriptionInput = screen.getByPlaceholderText(/Description/i);

    fireEvent.change(time, { target: { value: '2022-12-15T04:13:23' } });
    fireEvent.change(titleInput, { target: { value: 'Test Add Event' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a added test event' } });
    // click on the save button
    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);
    // check if the event is added to the database
    const event = mockData.events.testAddEvent;
    expect(event).not.toBeUndefined();
  })
  it('Given new event has been saved, event is displayed on the page', async () => {
    const mockUser = {
      uid: "testUser1",
      displayName: "Test User 1",
      email: "testuser1@gmail.com",
    };
    mockFirebase(mockUser);
    render(<App />);
    // check if the event is displayed on the page
    await screen.findByText(/Test Add Event/i);
  })
  it('Given new event is displayed on page, new event displays correct organizer',  async () => {   
    const mockUser = {
      uid: "testUser1",
      displayName: "Test User 1",
      email: "testuser1@gmail.com",
    };
    mockFirebase(mockUser);
    render(<App />);

    // check if the event has the correct organizer

    // user 3 should not exist
    var eventElement = screen.queryAllByText(/Organizer: Test User 3/)
    expect(eventElement).toHaveLength(0);

    // user 1 should exist
    eventElement = screen.queryAllByText(/Organizer: Test User 1/)
    expect(eventElement).not.toHaveLength(0)

  })
  it('Given new event is displayed on page, new event displays correct attendees',  async () => {   
    // check if the event has the correct attendees
    const event = mockData.events.testEvent
    const mockUser = {
      uid: "testUser1",
      displayName: "Test User 1",
      email: "testuser1@gmail.com",
    };
    mockFirebase(mockUser);
    const result = render(<EventCard event={event} eventId='testAddEvent' users={mockData.users} currentUser={mockUser} />)
	  expect(window.document.querySelector("#test-event-attendees")).not.toBeUndefined()
	  expect(!window.document.querySelector("#test-event-attendees-false")).toBe(true)
 	})
});
