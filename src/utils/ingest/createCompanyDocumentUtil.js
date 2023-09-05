// This util provides an interface for creating a company document and obtaining the id

const { databaseServices } = require('../../models/')

const createCompanyDocument = async (company_id, type, year, link) => {
    try {
      const companyObject = await databaseServices.companyServices.createCompany({
        company_id: company_id,
        document_type: type,
        year: year,
        upload_timestamp: new Date(),
        link: link.html,
        month: link.month,
      });
      return companyObject.id;
    } catch (error) {
      console.error("Error inserting into db 8-K: " + error.message);
      throw error;
    }
  };

  // Exporting the module

  module.exports = createCompanyDocument;
  