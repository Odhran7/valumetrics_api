// This module gets all the 8K records for a specific company

const { ingestDocs } = require("./ingestPineconeService");
const { formatFilingsService } = require("./formatFilingsService");
const { databaseServices } = require("../..");
const createCompanyDocument = require("../../../utils/ingest/createCompanyDocumentUtil");
const {
  filterValidDocsUtil,
} = require("../../../utils/ingest/formatDocsIngestUtil");
const retrieveItemAndFormatUtil = require('../../../utils/ingest/retrieveItemAndFormatUtil');
const checkTickerExistsUtil = require('../../../utils/ingest/checkTickerExistsUtil');

// Dict for mapping to sec api item 8k types

const itemDict8K = {
  1.01: "1-1",
  1.02: "1-2",
  1.03: "1-3",
  1.04: "1-4",
  2.01: "2-1",
  2.02: "2-2",
  2.03: "2-3",
  2.04: "2-4",
  2.05: "2-5",
  2.06: "2-6",
  3.01: "3-1",
  3.02: "3-2",
  3.03: "3-3",
  4.01: "4-1",
  4.02: "4-2",
  5.01: "5-1",
  5.02: "5-2",
  5.03: "5-3",
  5.04: "5-4",
  5.05: "5-5",
  5.06: "5-6",
  5.07: "5-7",
  5.08: "5-8",
  6.01: "6-1",
  6.02: "6-2",
  6.03: "6-3",
  6.04: "6-4",
  6.05: "6-5",
  7.01: "7-1",
  8.01: "8-1",
  9.01: "9-1",
};

/*

Helpful info on the standards applied to an 8k

 const itemDict8K = {
    "1-1": "Entry into a Material Definitive Agreement",
    "1-2": "Termination of a Material Definitive Agreement",
    "1-3": "Bankruptcy or Receivership",
    "1-4": "Mine Safety - Reporting of Shutdowns and Patterns of Violations",
    "2-1": "Completion of Acquisition or Disposition of Assets",
    "2-2": "Results of Operations and Financial Condition",
    "2-3":
      "Creation of a Direct Financial Obligation or an Obligation under an Off-Balance Sheet Arrangement of a Registrant",
    "2-4":
      "Triggering Events That Accelerate or Increase a Direct Financial Obligation or an Obligation under an Off-Balance Sheet Arrangement",
    "2-5": "Cost Associated with Exit or Disposal Activities",
    "2-6": "Material Impairments",
    "3-1":
      "Notice of Delisting or Failure to Satisfy a Continued Listing Rule or Standard; Transfer of Listing",
    "3-2": "Unregistered Sales of Equity Securities",
    "3-3": "Material Modifications to Rights of Security Holders",
    "4-1": "Changes in Registrant’s Certifying Accountant",
    "4-2":
      "Non-Reliance on Previously Issued Financial Statements or a Related Audit Report or Completed Interim Review",
    "5-1": "Changes in Control of Registrant",
    "5-2":
      "Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers; Compensatory Arrangements of Certain Officers",
    "5-3":
      "Amendments to Articles of Incorporation or Bylaws; Change in Fiscal Year",
    "5-4":
      "Temporary Suspension of Trading Under Registrant’s Employee Benefit Plans",
    "5-5":
      "Amendment to Registrant’s Code of Ethics, or Waiver of a Provision of the Code of Ethics",
    "5-6": "Change in Shell Company Status",
    "5-7": "Submission of Matters to a Vote of Security Holders",
    "5-8": "Shareholder Director Nominations",
    "6-1": "ABS Informational and Computational Material.",
    "6-2": "Change of Servicer or Trustee.",
    "6-3": "Change in Credit Enhancement or Other External Support.",
    "6-4": "Failure to Make a Required Distribution.",
    "6-5": "Securities Act Updating Disclosure.",
    "7-1": "Regulation FD Disclosure",
    "8-1": "Other Events",
    "9-1": "Financial Statements and Exhibits",
  };

*/

// This function retrieves and ingests all 8k filings

const ingest8KDocsService = async (ticker) => {
  try {
    const companyObject =
      await databaseServices.companySerices.getCompanyTickerById(ticker);
    const company_id = companyObject.id;
    const filings = await formatFilingsService(ticker, false, true, false, 3);

    checkTickerExistsUtil(filings);

    let documentsWithMetadata = [];

    for (let year in filings) {
      if (Array.isArray(filings[year]["8-K"])) {
        const nestedDocs = await Promise.all(
          filings[year]["8-K"].map(async (link) => {
            const document_id = await createCompanyDocument(
              company_id,
              "8-K",
              year,
              link.html,
              link.month,
            );
            const itemNumbersConverted = link.itemNumbers.map(
              (item) => itemDict8K[item]
            );
            return await retrieveItemAndFormatUtil(
              link,
              itemNumbersConverted,
              document_id,
              ticker,
              "8-K",
              year
            );
          })
        );
        documentsWithMetadata.push(...nestedDocs.flat());
      }
    }

    if (documentsWithMetadata.length) {
      documentsWithMetadata = filterValidDocsUtil(documentsWithMetadata);
      await ingestDocs(documentsWithMetadata);
    }
  } catch (error) {
    console.error("Error in ingest8kDocsService:", error);
    throw new Error(
      `Failed to ingest 8k docs for ticker ${ticker}: ${error.message}`
    );
  }
};

module.exports = {
  ingest8KDocsService,
};
