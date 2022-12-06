import {describe, it, vi} from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../../App';
import {useDbData, useAuthState, useDbUpdate} from '../../utilities/firebase';

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