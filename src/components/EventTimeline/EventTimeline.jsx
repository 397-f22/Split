import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import EventCard from "../EventCard/EventCard";

const EventTimeline = ({ currentUserEvents, users, currentUser }) => {
  const isComplete = (deadline, payments) => {
    const existingPayments = payments ?? { 0: { isPaid: true } };
    const isAllPaid = Object.entries(existingPayments).every(
      (val, key) => val[1].isPaid
    );
    //console.log("All paid? ", isAllPaid);
    const deadlineOver = new Date() > new Date(deadline) === true;
    return deadlineOver ? (isAllPaid ? "success" : "error") : "primary";
  };

  return (
    <Timeline
      position="alternate"
      sx={{ m: "auto 0" }}
      align="right"
      variant="body2"
      color="text.secondary"
    >
      {currentUserEvents.map(([id, eventData]) => {
        return (
          <TimelineItem className="mb-3 event-grid-container" key={id}>
            <TimelineOppositeContent color="textSecondary">
              {(new Date(eventData.deadline).toLocaleString("en-GB", {
                timeZone: "UTC",
              }).split(',')[0])}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                variant="outlined"
                color={isComplete(eventData.deadline, eventData.payments)}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <EventCard
                eventId={id}
                event={eventData}
                users={users}
                currentUser={currentUser}
              />
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default EventTimeline;
