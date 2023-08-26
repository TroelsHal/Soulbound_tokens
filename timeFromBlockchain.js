const TimeFromBlockchain = (timestamp) => {
  let timeString;
  if (parseInt(timestamp) == 0) {
    timeString = "No";
  } else {
    const date = new Date();
    date.setTime(parseInt(timestamp) * 1000);
    timeString = date.toUTCString();
  }
  return timeString;
};

export default TimeFromBlockchain;
