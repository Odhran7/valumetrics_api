// This util is used to identify if we can support a particular ticker for 404 errors

const checkTickerExists = (filings) => {
  if (!filings || Object.keys(filings).length === 0) {
    throw new Error("Ticker not found");
  }
};

module.exports = checkTickerExists;
