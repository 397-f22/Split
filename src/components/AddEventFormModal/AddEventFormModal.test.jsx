import { describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import { useDbData, useAuthState, useDbUpdate } from '../../utilities/firebase';

const mockData = {
  events: {
    'testEvent': {
      "attendees": [
        "testUser1",
        "testUser2",
      ],
      "deadline": "2022-12-01T04:13:23",
      "description": "This is a test event",
      "organizer": "testUser1",
      "payments": [
        {
          "amount": 0,
          "isPaid": true,
          "paid": false,
          "user": "testUser1",
        }
      ],
      "title": "Test Event",
    },
  },
  users: {
    'testUser1': {
      "displayName": "Test User 1",
      "email": "testuser1@gmail.com",
      "events": [
        "testEvent",
      ]
    },
    'testUser2': {
      "displayName": "Test User 2",
      "email": "testuser2@gmail.com",
      "events": [
        "testEvent",
      ]
    },
  },
};

// mock firebase
vi.mock('../../utilities/firebase')
const mockFirebase = (mockUser) => {
  // mock auth
  useAuthState.mockReturnValue([mockUser, null]);
  // mock db
  useDbData.mockImplementation((path) => {
    if (path === '/events') {
      return [mockData.events, null];
    } else if (path === '/users') {
      return [mockData.users, null];
    }
  });
  // mock profile
  // mock db update, update the mockData with new data
  // data format: {path: data}
  useDbUpdate.mockImplementation((path) => {
    const updateData = (data) => {
      Object.entries(data).forEach(([path, data]) => {
        // convert attendees to array
        if (data['attendees']) {
          data['attendees'] = Object.values(data['attendees']);
        }
        // convert payments to array
        if (data['payments']) {
          data['payments'] = Object.values(data['payments']);
        }
        const pathArr = path.split('/');
        // replace the event id with 'testAddEvent' by checking if the path is '/events/'
        for (let i = 0; i < pathArr.length; i++) {
          if (pathArr[i] === 'events') {
            pathArr[i + 1] = 'testAddEvent';
          }
        }
        let curr = mockData;
        for (let i = 0; i < pathArr.length; i++) {
          if (i === pathArr.length - 1) {
            curr[pathArr[i]] = data;
          } else {
            curr = curr[pathArr[i]];
          }
        }
      });
    }
    return [updateData, null];
  });

};
/**
 * @jest-environment jsdom
 */
// Given add event modal is open, when the user clicks the save button, the event is added to the database.
describe('add event button works?', () => {
  it('Given homepage when the user clicks on on the plus button, the add event modal opens', async () => {
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
