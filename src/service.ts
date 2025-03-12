import extractContent from "./contentExtractor";
import { generateEmbedding, generateResponse } from "./geminiClient";
import {
  checkIfArticleExists,
  searchArticles,
  storeArticle,
} from "./qdrantClient";

const extractLinkFromQuery = (query: string): string | null => {
  const urlRegex = /https?:\/\/[^\s]+/;
  const match = query.match(urlRegex);
  return match ? match[0] : null;
};

export const generateResponseService = async (query: string) => {
  // Check if the query contains a link
  const link = extractLinkFromQuery(query);

  if (link) {
    const linkContent = await extractContent(link);
    const articleExists = await checkIfArticleExists(link);

    if (!articleExists) {
      await storeArticle(link);
    }
    const article = await extractContent(link);
    generateResponse(query, [article]);
  }

  const queryEmbedding = await generateEmbedding(query);

  const searchResults = await searchArticles(queryEmbedding);

  const context = searchResults.map((result) => ({
    title: result.payload?.title as string,
    content: result.payload?.content as string,
    url: result.payload?.url as string,
    date: result.payload?.date as string,
  }));
  const response = await generateResponse(query, context);
  return {
    answer: response,
    sources: context.map((article) => ({
      title: article.title,
      url: article.url,
      date: article.date,
    })),
  };
};
