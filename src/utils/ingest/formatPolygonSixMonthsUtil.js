// This util is used to format the date exactly six months ago (free tier)

const formatPolygonSixMonthsUtil = () => {
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
  const formattedSixMonthsAgo = sixMonthsAgo.toISOString().split("T")[0];
  return formattedSixMonthsAgo;
};

export default formatPolygonSixMonthsUtil;
