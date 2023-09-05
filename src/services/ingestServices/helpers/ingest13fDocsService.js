// This service will be used to ingest the 13f docs

const { limiter } = require("../../../../config/bottleneck");
const { ingestDocs } = require("./ingestPineconeService");
const { formatFilingsService } = require("./formatFilingsService");
const { databaseServices } = require("../..");
const createCompanyDocument = require("../../../utils/ingest/createCompanyDocumentUtil");
const {
  filterValidDocsUtil,
} = require("../../../utils/ingest/formatDocsIngestUtil");
const https = require("https");
const zlib = require("zlib");
const createDocumentWithMetadataUtil = require("../../../utils/ingest/createDocumentWithMetadataUtil");
const checkTickerExistsUtil = require('../../../utils/ingest/checkTickerExistsUtil');

// This function ingests the 13f docs

const ingest13FDocsService = async (ticker) => {
  try {
    const companyObject =
      await databaseServices.companySerices.getCompanyTickerById(ticker);
    const company_id = companyObject.id;
    const filings = await formatFilingsService(ticker, false, true, false, 3);

    checkTickerExistsUtil(filings);

    let documentsWithMetadata = [];

    for (let year in filings) {
      if (Array.isArray(filings[year]["13F-HR"])) {
        const nestedDocs = await Promise.all(
          filings[year]["13F-HR"].map(async (link) => {
            try {
              const document_id = await createCompanyDocument(
                company_id,
                "13-F",
                year,
                link.html,
                link.month,
              );
              const content = await get13FContent(link.txt);
              return await retrieveItemAndFormat13F(
                link.link,
                link.txt,
                document_id,
                ticker,
                "13-F",
                year,
                content
              );
            } catch (error) {
              console.error(
                `Error processing link ${link.link} for year ${year}: ${error.message}`
              );
            }
          })
        );
        documentsWithMetadata.push(...nestedDocs.flat());
      }
    }

    if (documentsWithMetadata.length) {
      documentsWithMetadata = filterValidDocsUtil(documentsWithMetadata);
      const result = await ingestDocs(documentsWithMetadata);
    }
  } catch (error) {
    console.error(`Error processing 13F for ${ticker}: ${error.message}`);
  }
};

// This function gets the data from the .txt link and parses the 'useful' part of it

const get13FContent = async (url) => {
  try {
    const data = await getData(url);
    const startMarker = "<TEXT>";
    const endMarker = "</TEXT>";
    const startIndex = data.indexOf(startMarker) + startMarker.length;
    const endIndex = data.indexOf(endMarker);
    let textContent;
    const xmlTextContent = data.slice(startIndex, endIndex);
    xml2js.parseString(xmlTextContent, (err, result) => {
      if (err) {
        throw new Error(
          `Error parsing XML content from ${url}: ${err.message}`
        );
      }
      textContent = JSON.stringify(result);
    });
    return textContent;
  } catch (error) {
    console.error(`Error retrieving 13F content from ${url}: ${error.message}`);
    throw error;
  }
};

// This function gets the data and parses it correctly 

const getData = (url) => {
  return limiter.schedule(() => {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Valumetrics valumetrics.ai",
          "Accept-Encoding": "gzip, deflate",
        },
      };

      https
        .get(url, options, (res) => {
          const encoding = res.headers["content-encoding"];
          let stream = res;

          if (encoding === "gzip") {
            stream = res.pipe(zlib.createGunzip());
          } else if (encoding === "deflate") {
            stream = res.pipe(zlib.createInflate());
          }

          let data = "";

          stream.on("data", (chunk) => {
            data += chunk;
          });

          stream.on("end", () => {
            resolve(data);
          });
        })
        .on("error", (err) => {
          console.error(`Error fetching data from ${url}: ${err.message}`);
          reject(err);
        });
    });
  });
};

// Function creates the document and metadata for 13f filing

const retrieveItemAndFormat13F = async (
  link,
  txt,
  document_id,
  ticker,
  type,
  year,
  content
) => {
  try {
    const metadata = {
      id: document_id,
      ticker: ticker,
      type: type,
      year: year,
      link: link,
      txt: txt,
    };

    const documentsWithMetadata = await createDocumentWithMetadataUtil(
      content,
      metadata
    );

    if (!documentsWithMetadata.length) {
      console.log(`No documents found for URL: ${link}`);
    } else {
      console.log("Documents prepared successfully!");
    }

    return documentsWithMetadata;
  } catch (error) {
    console.error(`Error formatting document for ${link}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  ingest13FDocsService,
};
