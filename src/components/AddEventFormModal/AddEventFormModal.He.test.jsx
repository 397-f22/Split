import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { mockData, mockFirebase } from '../../helpers';

// mock firebase
vi.mock('../../utilities/firebase')
/**
 * @jest-environment jsdom
 */
// Given add event modal is open, when the user clicks the save button, the event is added to the database.
describe('add event button works?', () => {
  // check if the event is added to the database => Ping and Shalini
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

    // check if the event is displayed on the page
    await screen.findByText(/Test Add Event/i);

    // for Shalini: check if the event has the correct organizer; check if the event has the correct attendees

  })
});
