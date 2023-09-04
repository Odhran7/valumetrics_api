// This service will be used to handle the creation of companies

const { Company } = require("../../../models");

// Function used to create a company

const createCompany = async (data) => {
  try {
    const company = await Company.create(data);
    return Company;
  } catch (error) {
    console.log("There was an error creating a company");
    throw error();
  }
};

// Function used to query company by id

const getCompanyById = async (id) => {
    try {
        const company = await Company.findByPk(id);
        return company;
    } catch (error) {
        throw error;
    }
};

// Function used to get company id by ticker

const getCompanyTickerById = async (ticker) => {
  try {
    const company = Company.findAll({
        where: {
            ticker: ticker,
        }
    });
    return company;
  } catch (error) {
    console.log("There was an error getting the company id by the ticker");
    throw error();
  }
};

// Export the functions

module.exports = {
  createCompany,
  getCompanyById,
  getCompanyTickerById,
};
