// This service is used to ingest news articles into the vector database

const { ingestDocs } = require("./ingestPineconeService");
const { databaseServices } = require("../..");
const createCompanyDocument = require("../../../utils/ingest/createCompanyDocumentUtil");
const {
  filterValidDocsUtil,
} = require("../../../utils/ingest/formatDocsIngestUtil");
const {
  formatPolygonSixMonthsUtil,
} = require("../../../utils/ingest/formatPolygonSixMonthsUtil");
const polygonConfig = require("../../../../config/polygon");
const { extract } = require("@extractus/article-extractor");
const { convert } = require("html-to-text");

// This function is used to ingest the news articles

const ingestNewsService = async (ticker) => {
  try {
    const companyObject =
      await databaseServices.companySerices.getCompanyTickerById(ticker);
    const { id: company_id } = companyObject;
    const formattedSixMonthsAgo = formatPolygonSixMonthsUtil();
    const url = `${polygonConfig.polygon.baseURL}${polygonConfig.polygon.endpoints.referenceNews}?ticker=${ticker}&published_utc.gte=${formattedSixMonthsAgo}&limit=${polygonConfig.polygon.defaultLimit}&apiKey=${polygonConfig.polygon.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.results) {
      await formatArticles(data.results, company_id, ticker);
    } else {
      console.error("No results found in the response", data);
    }
  } catch (error) {
    console.error(
      `Error in ingestNewsService for ticker ${ticker}: ${error.message}`
    );
  }
};

// This formats the articles and obtains the info needed for the metadata

const formatArticles = async (articles, company_id, ticker) => {
  try {
    return Promise.all(
      articles.map(async (article) => {
        const { title, article_url, publisher, published_utc } = article;
        const date = new Date(published_utc);
        const { name: publisherName } = publisher;
        const year = date.getFullYear();
        const month = date.getMonth();
        const document_id = await createCompanyDocument(
          company_id,
          "News Article",
          year,
          article_url,
          month
        );
        return extractContentAndIngest(
          company_id,
          ticker,
          document_id,
          title,
          article_url,
          publisherName,
          year,
          month
        );
      })
    );
  } catch (error) {
    console.error(
      `Error in formatArticles for ticker ${ticker}: ${error.message}`
    );
  }
};

// This function gets the content, formats the documents AND ingests it

const extractContentAndIngest = async (
  company_id,
  ticker,
  document_id,
  title,
  article_url,
  publisherName,
  year,
  month
) => {
  console.log(`Processing article from URL: ${article_url}`);
  try {
    const articleObj = await extract(article_url);
    const text = convert(articleObj.content);
    const metadata = {
      id: document_id,
      company_id,
      ticker,
      type: "News Article",
      year,
      month,
      headline: title,
      url: article_url,
      provider: publisherName,
      isUseful: true, // Needs to be put in an ML model
    };
    const documentsWithMetadata = await createDocumentWithMetadataUtil(
      text,
      metadata
    );
    if (!documentsWithMetadata.length) {
      console.warn(`No news articles found for ticker: ${ticker}`);
    } else {
      const validDocs = filterValidDocsUtil(documentsWithMetadata);
      const result = await ingestDocs(validDocs);
      console.log(
        `News Article ${ticker}, url: ${article_url} for year: ${year} and month: ${month} has been uploaded successfully!`
      );
    }
  } catch (error) {
    console.error(
      `Error in extractContentAndIngest for URL ${article_url}: ${error.message}`
    );
  }
};

module.exports = {
  ingestNewsService,
};
