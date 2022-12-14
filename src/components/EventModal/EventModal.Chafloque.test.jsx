import { describe, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App";
import { mockData, mockFirebase } from "../../helpers";

// mock firebase
vi.mock("../../utilities/firebase");
/**
 * @jest-environment jsdom
 */

// When the user clicks on an event detail button, the event details are displayed in a modal.
describe("Given homepage", () => {
  it("When the user clicks on an event, then the event details modal displays attendees", async () => {
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
    // delete AND close button
    expect(await screen.findByText(/Payments/i));
  });

  it("When the user clicks on an event and their payment button, then the payment is marked completed", async () => {
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
    // click on the save button
    const payButton = screen.getByText(/Pay now!/i);
    fireEvent.click(payButton);

    const isPaid = mockData.events.testEvent.payments[1].isPaid;
    expect(isPaid).toBe(true);
  });
});
