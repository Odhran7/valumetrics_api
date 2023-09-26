// This util extracts numberOfWords keywords from the article

import natural from "natural";
const tokenizer = new natural.WordTokenizer();
import sw from "stopword";

const keywordExtractionUtil = (text, numberOfWords = 20) => {
  let words = tokenizer.tokenize(text.toLowerCase());
  words = sw.removeStopwords(words);
  words = words.filter((word) => isNaN(word));
  let frequencyCount = words.reduce((prev, curr) => {
    prev[curr] = (prev[curr] || 0) + 1;
    return prev;
  }, {});
  let sortedWords = Object.keys(frequencyCount).sort(
    (a, b) => frequencyCount[b] - frequencyCount[a]
  );
  return sortedWords.slice(0, numberOfWords);
};

export default keywordExtractionUtil;
