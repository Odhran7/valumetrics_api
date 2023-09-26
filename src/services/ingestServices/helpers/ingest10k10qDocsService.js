// This module gets all the 10K & 10Q records for a specific company

import { ingestDocs } from "./ingestPineconeService";
import { formatFilingsService } from "./formatFilingsService";
import createCompanyDocument from "../../../utils/ingest/createCompanyDocumentUtil";
import { filterValidDocsUtil } from "../../../utils/ingest/formatDocsIngestUtil";
import retrieveItemAndFormatUtil from "../../../utils/ingest/retrieveItemAndFormatUtil";
import checkTickerExistsUtil from "../../../utils/ingest/checkTickerExistsUtil";

// Creation of dicts for item retrieval

const itemDict10K = {
  1: "Business",
  "1A": "Risk Factors",
  "1B": "Unresolved Staff Comments",
  2: "Properties",
  3: "Legal Proceedings",
  4: "Mine Safety Disclosures",
  5: "Market for Registrant’s Common Equity, Related Stockholder Matters and Issuer Purchases of Equity Securities",
  6: "Selected Financial Data (prior to February 2021)",
  7: "Management’s Discussion and Analysis of Financial Condition and Results of Operations",
  "7A": "Quantitative and Qualitative Disclosures about Market Risk",
  8: "Financial Statements and Supplementary Data",
  9: "Changes in and Disagreements with Accountants on Accounting and Financial Disclosure",
  "9A": "Controls and Procedures",
  "9B": "Other Information",
  10: "Directors, Executive Officers and Corporate Governance",
  11: "Executive Compensation",
  12: "Security Ownership of Certain Beneficial Owners and Management and Related Stockholder Matters",
  13: "Certain Relationships and Related Transactions, and Director Independence",
  14: "Principal Accountant Fees and Services",
};

const itemDict10Q = {
  part1item1: "Business",
  part1item2: "Risk Factors",
  part1item3: "Unresolved Staff Comments",
  part1item4: "Properties",
  part2item1: "Legal Proceedings",
  part2item1a: "Mine Safety Disclosures",
  part2item2:
    "Market for Registrant’s Common Equity, Related Stockholder Matters and Issuer Purchases of Equity Securities",
  part2item3: "Selected Financial Data (prior to February 2021)",
  part2item4:
    "Management’s Discussion and Analysis of Financial Condition and Results of Operations",
  part2item5: "Quantitative and Qualitative Disclosures about Market Risk",
  part2item6: "Financial Statements and Supplementary Data",
};

// This function ingests 10K 10Q docs into the system

const ingest10K10QDocsService = async (ticker, databaseServices) => {
  try {
    const companyObject =
      await databaseServices.companySerices.getCompanyTickerById(ticker);
    const company_id = companyObject.id;
    const filings = await formatFilingsService(ticker, false, true, false, 3);

    checkTickerExistsUtil(filings);

    let documentsWithMetadata = [];

    for (let year in filings) {
      if (Array.isArray(filings[year]["10-Q"])) {
        const nestedDocs = await Promise.all(
          filings[year]["10-Q"].map(async (link) => {
            const document_id = await createCompanyDocument(
              company_id,
              "10-Q",
              year,
              link.html,
              link.month,
              databaseServices
            );
            const itemNumbersConverted = Object.keys(itemDict10Q);
            return await retrieveItemAndFormatUtil(
              link,
              itemNumbersConverted,
              document_id,
              ticker,
              "10-Q",
              year
            );
          })
        );
        documentsWithMetadata.push(...nestedDocs.flat());
      }

      if (Array.isArray(filings[year]["10-K"])) {
        const nestedDocs = await Promise.all(
          filings[year]["10-K"].map(async (link) => {
            const document_id = await createCompanyDocument(
              company_id,
              "10-K",
              year,
              link
            );
            const itemNumbersConverted = Object.keys(itemDict10K);
            return await retrieveItemAndFormatUtil(
              link,
              itemNumbersConverted,
              document_id,
              ticker,
              "10-K",
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
    console.error(`Error processing 10K/10Q for ${ticker}: ${error.message}`);
  }
};

export { ingest10K10QDocsService };
