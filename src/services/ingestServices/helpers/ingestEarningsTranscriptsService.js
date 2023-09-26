// This function handles the ingestion of earnings transcripts

import createCompanyDocument from "../../../utils/ingest/createCompanyDocumentUtil";
import { filterValidDocsUtil } from "../../../utils/ingest/formatDocsIngestUtil";
import https from "https";
import createDocumentWithMetadataUtil from "../../../utils/ingest/createDocumentWithMetadataUtil";
import financialModellingPrepConfig from "../../../../config/financialModellingApi";
import { ingestDocs } from "./ingestPineconeService";

// This function handles the ingestion of earnings transcripts

const ingestEarningsTranscriptsService = async (ticker, databaseServices) => {
  let processedData = [];
  try {
    const company_id_obj =
      await databaseServices.companyService.getCompanyByTicker(ticker);
    const company_id = company_id_obj.id;

    const transcriptList = await getEarningsTranscriptList(ticker);
    for (const transcript of transcriptList) {
      const [quarter, year, dateAndTime] = transcript;

      const document_id = await createCompanyDocument(
        company_id,
        "Earnings Transcript",
        year,
        "Unavailable",
        quarter,
        databaseServices
      );
      const response = await getEarningsTranscript(ticker, quarter, year);

      const docs = await formatAndCreateDocsEarningTranscript(
        response[0].content,
        dateAndTime,
        ticker,
        quarter,
        year,
        document_id,
        "Earnings Transcript"
      );
      processedData.push(...docs.flat());
    }

    if (processedData.length) {
      const validDocs = filterValidDocsUtil(processedData);
      await ingestDocs(validDocs);
    }
  } catch (error) {
    console.error(
      `Error in ingestEarningsTranscriptsService: ${error.message}`
    );
  }
  console.log(processedData);
};

// This function formats and creates the returned earnings transcript

const formatAndCreateDocsEarningTranscript = async (
  content,
  time,
  ticker,
  quarter,
  year,
  document_id,
  type
) => {
  try {
    const metadata = { id: document_id, ticker, type, year, quarter, time };
    const documentsWithMetadata = await createDocumentWithMetadataUtil(
      content,
      metadata
    );

    if (!documentsWithMetadata.length) {
      console.warn(`No documents found for ticker: ${ticker}`);
    } else {
      console.log(
        `Earning transcript ${ticker} for quarter ${quarter} for ${year} has been uploaded successfully!`
      );
    }
    return documentsWithMetadata;
  } catch (error) {
    console.error(
      `Error in retrieveAndFormatEarningTranscript: ${error.message}`
    );
    throw error;
  }
};

// This function gets a list fo earning transcripts

const getEarningsTranscriptList = (ticker) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: financialModellingPrepConfig.financialModelingPrep.hostname,
      port: financialModellingPrepConfig.financialModelingPrep.port,
      path: `${financialModellingPrepConfig.financialModelingPrep.endpoints.earningsTranscriptList}?symbol=${ticker}&apikey=${financialModellingPrepConfig.financialModelingPrep.apiKey}`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
    });

    req.on("error", (e) => {
      console.error(`Error in getEarningsTranscriptList: ${e.message}`);
      reject(e);
    });

    req.end();
  });
};

// This function gets a particular earning transcript

const getEarningsTranscript = async (ticker, quarter, year) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: financialModellingPrepConfig.financialModelingPrep.hostname,
      port: financialModellingPrepConfig.financialModelingPrep.port,
      path: `${financialModellingPrepConfig.financialModelingPrep.endpoints.earningsTranscript}/${ticker}?quarter=${quarter}&year=${year}&apikey=${financialModellingPrepConfig.financialModelingPrep.apiKey}`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
    });

    req.on("error", (e) => {
      console.error(`Error in getEarningsTranscript: ${e.message}`);
      reject(e);
    });

    req.end();
  });
};

export { ingestEarningsTranscriptsService };
