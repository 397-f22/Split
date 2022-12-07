import { useDbData, useAuthState, useDbUpdate } from "./utilities/firebase";

export const mockData = {
  events: {
    testEvent: {
      attendees: ["testUser1", "testUser2"],
      deadline: "2022-12-01T04:13:23",
      description: "This is a test event",
      organizer: "testUser1",
      payments: [
        {
          amount: 0,
          isPaid: true,
          user: "testUser1",
        },
        {
          amount: 30,
          isPaid: false,
          user: "testUser2",
        },
      ],
      title: "Test Event",
    },
  },
  users: {
    testUser1: {
      displayName: "Test User 1",
      email: "testuser1@gmail.com",
      events: ["testEvent"],
    },
    testUser2: {
      displayName: "Test User 2",
      email: "testuser2@gmail.com",
      events: ["testEvent"],
    },
  },
};
export const mockFirebase = (mockUser) => {
  // mock auth for non-logged in user and logged in user
  if (mockUser === undefined) {
    useAuthState.mockReturnValue([null, null]);
  } else {
    useAuthState.mockReturnValue([mockUser, null]);
  }
  // mock db
  useDbData.mockImplementation((path) => {
    if (path === "/events") {
      return [mockData.events, null];
    } else if (path === "/users") {
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
          if (data["attendees"]) {
            data["attendees"] = Object.values(data["attendees"]);
          }
          if (data["payments"]) {
            data["payments"] = Object.values(data["payments"]);
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
    };
    return [updateData, null];
  });
};
