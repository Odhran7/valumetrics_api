// This util groups the raw filings by year

const groupByYearUtil = (filings) => {
  const grouped = filings.reduce((result, filing) => {
    const year = new Date(filing.filedAt).getFullYear();
    if (!result[year]) {
      result[year] = [];
    }
    result[year].push(filing);
    return result;
  }, {});
  return grouped;
};

module.exports = {
  groupByYearUtil,
};
