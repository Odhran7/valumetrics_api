// This util provides an interface for creating a company document and obtaining the id

const createCompanyDocument = async (company_id, type, year, link, month, databaseServices) => {
    try {
      const companyObject = await databaseServices.companyServices.createCompany({
        company_id: company_id,
        document_type: type,
        year: year,
        upload_timestamp: new Date(),
        link: link,
        month: month,
      });
      return companyObject.id;
    } catch (error) {
      console.error("Error inserting into db 8-K: " + error.message);
      throw error;
    }
  };

  // Exporting the module

export default createCompanyDocument;