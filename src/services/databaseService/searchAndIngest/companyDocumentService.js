// Service will be used to handle the creation and retrievel of company documents

import { CompanyDocument } from "../../../models";

// Function used to create a company document

const createCompanyDocument = async (data) => {
  try {
    const companyDocument = await CompanyDocument.create(data);
    return companyDocument;
  } catch (error) {
    console.log("There was an error creating a new company document");
    throw new Error();
  }
};

// Function used to retrieve company document by id

const getCompanyDocumentById = async (id) => {
  try {
    const companyDocument = await CompanyDocument.findByPk(id);
    return companyDocument;
  } catch (error) {
    console.log("There was an error getting the company document by id");
    throw new Error();
  }
};

// Function used to retrieve all docs by company id

const getCompanyDocumentsByCompanyId = async (companyId) => {
  try {
    const companyDocument = await CompanyDocument.findAll({
      where: {
        company_id: companyId,
      },
    });
    return companyDocument;
  } catch (error) {
    console.log("There was error getting company document by company id");
    throw new Error();
  }
};

// Function used to retrieve all docs by ticker

const getCompanyDocumentsByTicker = async (ticker) => {
  try {
    const companyDocument = await CompanyDocument.findAll({
      where: {
        ticker: ticker,
      },
    });
    return companyDocument;
  } catch (error) {
    console.log("There was error getting company document by ticker");
    throw new Error();
  }
};

// Function used to retrieve all docs by document_type and company_id

const getCompanyDocumentsByDocumentType = async (company_id, docType) => {
  try {
    const companyDocument = await CompanyDocument.findAll({
      where: {
        company_id: company_id,
        document_type: docType,
      },
    });
    return companyDocument;
  } catch (error) {
    console.log(
      "There was error getting company document by company id and document type"
    );
    throw new Error();
  }
};

// Function used to retrieve all docs by document_type and year

const getCompanyDocumentsByDocumentTypeAndYear = async (
  company_id,
  docType,
  year
) => {
  try {
    const companyDocument = await CompanyDocument.findAll({
      where: {
        company_id: company_id,
        document_type: docType,
        year: year,
      },
    });
    return companyDocument;
  } catch (error) {
    console.log(
      "There was error getting company document by company id, document type and year"
    );
    throw new Error();
  }
};

// Exporting the modules

export {
  createCompanyDocument,
  getCompanyDocumentById,
  getCompanyDocumentsByCompanyId,
  getCompanyDocumentsByTicker,
  getCompanyDocumentsByDocumentTypeAndYear,
  getCompanyDocumentsByDocumentType,
};
