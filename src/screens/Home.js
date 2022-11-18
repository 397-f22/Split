import React from "react";
import { useDbData } from "../utilities/firebase";
import { useProfile } from "../utilities/userProfile";

const Home = () => {
  const [events, errorEvents, isLoadingEvents] = useDbData("/events");
  const [users, errorUsers, isLoadingUsers] = useDbData("/users");
  const [currentUser, error, isLoading] = useProfile();
  if (errorEvents || errorUsers)
    return <h1>Error loading data: {`${error}`}</h1>;
  if (isLoadingEvents || isLoadingUsers) return <h1>Loading users data...</h1>;

  if (!currentUser) return;
  if (!users) return <div> No Users </div>;

  const currentUserInformation = Object.entries(users).filter(
    ([id, user]) => id === currentUser.uid
  )[0][1];  
  const currentUserEventIds = Object.values(currentUserInformation.events);
  
  const currentUserEvents = Object.entries(events).filter(
    ([id, event]) => currentUserEventIds.includes(id)
  );

  console.log(currentUserEvents);

  return (
    <div>
      <h1>Split App</h1>
      <div>
        {currentUserEvents.map(([id, eventData]) => (eventData.title))}
      </div>
    </div>
  );
};

export default Home;
