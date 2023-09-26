// This util extracts the year, month, day & time of a string

const extractDate = (dateStr) => {
  const [year, month, day] = dateStr.split(" ")[0].split("-");
  const time = dateStr.split(" ")[1];
  return {
    year: year,
    month: month,
    day: day,
    time: time,
  };
};

export default extractDate;