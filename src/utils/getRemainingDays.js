const getRemainingDays = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);

  // Remove time
  today.setHours(0, 0, 0, 0);
  event.setHours(0, 0, 0, 0);

  const diffTime = event - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Event Ended";
  if (diffDays === 0) return "Today";

  return `${diffDays}`;
};

export default getRemainingDays