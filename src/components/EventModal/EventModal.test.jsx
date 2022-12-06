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
        },
        {
          "amount": 30,
          "isPaid": true,
          "paid": false,
          "user": "testUser2",
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
        const eventsRegexMatches = path.match(/events\/([^\/]+)$/);
        const paymentsRegexMatches = path.match(/events\/([^\/]+)\/payments$/);
        if (eventsRegexMatches !== null) {
          if (data['attendees']) {
            data['attendees'] = Object.values(data['attendees']);
          }
          if (data['payments']) {
            data['payments'] = Object.values(data['payments']);
          }
          const eventId = eventsRegexMatches[1];
          // if new event - use a deterministic uuid?
          if (mockData.events[eventId] === undefined) {
            mockData.events.testAddEvent = data;
          } else {
            mockData.events[eventId] = data;
          }
        }
        if (paymentsRegexMatches !== null) {
          const eventId = paymentsRegexMatches[1];
          mockData.events[eventId].payments = data;
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

  it('Given modal popped up, payments should display', async () => {
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
  })

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