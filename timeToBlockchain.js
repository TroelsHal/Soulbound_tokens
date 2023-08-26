const TimeToBlockchain = (timeString) => {
  const date = new Date();
  date.setTime(parseInt(timestamp) * 1000);
  timeString = date.toUTCString();
  return timeString;
};

export default TimeToBlockchain;
