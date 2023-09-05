// This service is for ingesting the patents

const { finnhubClient } = require("../../../../config/finnhub");
const puppeteer = require("puppeteer");
const pdfjsLib = require("pdfjs-dist");
const createCompanyDocument = require("../../../utils/ingest/createCompanyDocumentUtil");
const { databaseServices } = require("../..");
const extractDate = require("../../../utils/ingest/extractDateUtil");
const createDocumentWithMetadataUtil = require("../../../utils/ingest/createDocumentWithMetadataUtil");
const { ingestDocs } = require("./ingestPineconeService");
const {
  filterValidDocsUtil,
} = require("../../../utils/ingest/formatDocsIngestUtil");

// This function ingests patents into the database

const ingestPatentsService = async (ticker) => {
  let processed_data = [];
  try {
    const company_id =
      await databaseServices.companyServices.getCompanyByTicker(ticker);
    const patentList = await getPatentFilingsForYear(
      ticker,
      "2020-06-01",
      "2021-06-10"
    );

    for (const patent of patentList) {
      const { description, filingStatus, patentNumber, publicationDate } =
        patent;
      if (patentNumber && patentNumber.trim() !== "") {
        const dateObj = extractDate(publicationDate);
        const document_id = createCompanyDocument(
          company_id,
          "Intellectual Property",
          dateObj.year,
          patent.article_url,
          dateObj.month
        );
        const urls = await getPatentInfo(patentNumber, "en");
        if (urls.PatentFilingPdf) {
          const pdfContent = await getPdfContentAsText(urls.PatentFilingPdf);
          const docs = await formatAndCreateDocsPatents(
            ticker,
            document_id,
            urls,
            pdfContent,
            description,
            filingStatus,
            patentNumber,
            "Intellectual Property",
            dateObj
          );
          processed_data.push(docs);
        }
      }
    }
  } catch (error) {
    console.error(
      `Error in ingestPatentsService for ticker ${ticker}: ${error.message}`
    );
  }
  console.log(processed_data);
};

// This patent interacts with the clinent to get a list of patent filings for a time period

const getPatentFilingsForYear = async (ticker, start, end) => {
  return new Promise((resolve, reject) => {
    finnhubClient.stockUsptoPatent(
      ticker,
      start,
      end,
      (error, data, response) => {
        if (error) {
          console.error(
            `Error in getPatentFilingsForYear for ticker ${ticker}: ${error.message}`
          );
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};

// This gets the url for the patent so we can analyse the content

const getPatentInfo = async (patentNumber, languageCode) => {
  const url = `https://patents.google.com/patent/${patentNumber}/${languageCode}`;
  console.log(`This is the url ${url}`);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["stylesheet", "font", "image"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const hrefs = await page.$$eval(
      "a.style-scope.patent-result[target='_blank']",
      (links) => links.map((link) => link.href)
    );
    await browser.close();
    return {
      PatentFilingPDF: hrefs[0],
      USPTOApplication: hrefs[1],
      USPTOPatentCenter: hrefs[2],
      USPTOPatentAssignmentSearch: hrefs[3],
      Espacenet: hrefs[4],
      GlobalDossier: hrefs[5],
      PatentsStackExchange: hrefs[6],
    };
  } catch (error) {
    console.error(
      `Error getting patent info for patent ${patentNumber}: ${error.message}`
    );
    return {};
  }
};

// This gets the text content of the pdf from the patent

const getPdfContentAsText = async (url) => {
  console.log("Url in pdf " + url);
  try {
    const pdf = await pdfjsLib.getDocument({
      url: url,
      cMapUrl: "node_modules/pdfjs-dist/cmaps/",
      cMapPacked: true,
    }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ");
    }
    return text;
  } catch (error) {
    console.error(
      `Error extracting content from PDF at ${url}: ${error.message}`
    );
    return "";
  }
};

 // This formats and creates docs for each patent

const formatAndCreateDocsPatents = async (
  ticker,
  document_id,
  urls,
  pdfContent,
  description,
  filingStatus,
  patentNumber,
  type,
  dateObj
) => {
  try {
    const metadata = {
      id: document_id,
      ticker,
      type,
      year: dateObj.year,
      month: dateObj.month,
      day: dateObj.day,
      time: dateObj.time,
      filingStatus,
      patentNumber,
      linkPdf: urls.PatentFilingPDF,
      description,
      USPTOApplication: urls.USPTOApplication,
      Espacenet: urls.Espacenet,
      PatentsStackExchange: urls.PatentsStackExchange,
    };
    const documentsWithMetadata = await createDocumentWithMetadataUtil(
      pdfContent,
      metadata
    );
    if (!documentsWithMetadata.length) {
      console.warn(`No patents found for ticker: ${ticker}`);
      return [];
    } else {
      const validDocs = await filterValidDocsUtil(documentsWithMetadata);
      await ingestDocs(validDocs);
      console.log(
        `Patent ${patentNumber} for ticker ${ticker} has been uploaded successfully!`
      );
      return validDocs;
    }
  } catch (error) {
    console.error(
      `Error in formatAndCreateDocsPatents for patent ${patentNumber}: ${error.message}`
    );
    return [];
  }
};

module.exports = {
    ingestPatentsService,
};
