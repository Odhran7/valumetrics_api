// This util is used to prevent rate limits from the sec-api

import { extractorApi } from "../../../config/secApi";

// Timeout for rate limit

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Gets 10k, 10q & 8k item section

const getSection = async (link, item, format) => {
  return await extractorApi.getSection(link, item, format);
};

// Error callback for status '429' and logging details plus exponential back-off

const handleRateLimitError = async (error, retries) => {
  if (error.response && error.response.status === 429) {
    const retryAfter = error.response.headers["retry-after"];
    if (retryAfter) {
      console.log(`Rate limit error. Retrying in ${retryAfter} seconds.`);
      await sleep(retryAfter * 1000);
    } else {
      const retryIn = Math.pow(2, retries);
      console.log(
        `Rate limit error, but retry-after header not present. Retrying in ${retryIn} seconds.`
      );
      await sleep(retryIn * 1000);
    }
  } else {
    throw error;
  }
};

// Main function

const rateLimitSecApiUtil = async (link, item, format) => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await getSection(link, item, format);
    } catch (error) {
      await handleRateLimitError(error, retries);
      retries++;
    }
  }

  throw new Error("Max retries exceeded.");
};

export default rateLimitSecApiUtil;
