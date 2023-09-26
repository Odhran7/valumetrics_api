// This service is used for the retrieval and creation of vectors

import { Vector } from "../../../models";

// Function used to create a Vector

const createVector = async (data) => {
  try {
    const vector = await Vector.create(data);
    return vector;
  } catch (error) {
    console.log("There was an error creating a vector");
    throw error();
  }
};

// Function used to retrieve a vector by id

const getVectorById = async (id) => {
  try {
    const vector = await Vector.findByPk(id);
    return vector;
  } catch (error) {
    console.log("There was an error retrieving a vector by id");
    throw error();
  }
};

// Function used to retrieve vectors by document 9d

const getVectorByDocumentId = async (document_id) => {
  try {
    const vector = await Vector.findAll({
      where: {
        document_id: document_id,
      },
    });
    return vector;
  } catch (error) {
    console.log("There was an error retrieving a vector by document id");
    throw error();
  }
};

// Function used to retrieve a group of vectors by an array of document ids

const getVectorsByDocumentIds = async (ids) => {
  try {
    const vectors = await Vector.findAll({
      where: {
        document_id: ids,
      },
    });
    return vectors;
  } catch (error) {
    console.log("There was an error retrieving vectors by document ids");
    throw error();
  }
};

// Exporting the functions

export {
  createVector,
  getVectorById,
  getVectorByDocumentId,
  getVectorsByDocumentIds,
};
