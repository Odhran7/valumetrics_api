// This util groups together the filings by year with link, html, txt and the month

const { queryApi } = require("../../../../config/secApi");
const {
  getDateXYearsAgoUtil,
} = require("../../../utils/ingest/getDateXYearsAgoUitl");
const { groupByYearUtil } = require("../../../utils/ingest/groupByYearUtil");
const {
  structureFilingsUtil,
} = require("../../../utils/ingest/structureFilingsUtils");

// This function selects the correct query to pass to the sec api

const getSecApiQuery = (ticker, date, formType) => {
  switch (formType) {
    case "eightK":
      return {
        query: {
          query_string: {
            query: `ticker:"${ticker}" && (formType:"8-K") && filedAt:[${date}]`,
          },
        },
        from: "0",
        size: "1000",
        sort: [{ filedAt: { order: "desc" } }],
      };
    case "tenKTenQ":
      return {
        query: {
          query_string: {
            query: `ticker:"${ticker}" && (formType:"10-Q" || formType:"10-K") && filedAt:[${date}]`,
          },
        },
        from: "0",
        size: "1000",
        sort: [{ filedAt: { order: "desc" } }],
      };
    case "thirteenF":
      return {
        query: {
          query_string: {
            query: `holdings.ticker:"${ticker}" AND formType:"13F-HR" AND NOT formType:"13F-HR/A" AND filedAt:[${date}]`,
          },
        },
        from: "0",
        size: "1000",
        sort: [{ filedAt: { order: "desc" } }],
      };
    default:
      throw new Error("Invalid formType provided");
  }
};

// This formats the filings by year and type with links

const formatFilingsService = async (
  ticker,
  eightK,
  tenKTenQ,
  thirteenF,
  lastXYears
) => {
  const date = getDateXYearsAgoUtil(lastXYears);
  let formType;

  if (eightK) formType = "eightK";
  else if (tenKTenQ) formType = "tenKTenQ";
  else if (thirteenF) formType = "thirteenF";
  else throw new Error("No valid formType provided");

  const secApiQuery = getSecApiQuery(ticker, date, formType);

  try {
    const filings = await queryApi.getFilings(secApiQuery);
    const filingsByYear = groupByYearUtil(filings.filings);
    const filingLinksByYearAndFormType = structureFilingsUtil(
      filingsByYear,
      eightK
    );
    return filingLinksByYearAndFormType;
  } catch (error) {
    console.error("There is an error in the getFilings function: " + error);
    throw error;
  }
};

module.exports = {
  formatFilingsService,
};
