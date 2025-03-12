import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
import { generateEmbedding } from "./geminiClient";
import { v4 as uuidv4 } from "uuid";
import extractContent from "./contentExtractor";

dotenv.config();

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_PATH,
  apiKey: process.env.QDRANT_API_KEY,
});

export const initializeQdrant = async () => {
  const collectionName = "news_articles";

  try {
    // Check if the collection already exists
    const existingCollections = await qdrantClient.getCollections();
    const collectionExists = existingCollections.collections.some(
      (collection) => collection.name === collectionName
    );

    if (!collectionExists) {
      // Create a new collection
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: 768, // Adjust based on the embedding size from Gemini's embedding model
          distance: "Cosine",
        },
      });
      console.log(`Collection "${collectionName}" created.`);
    } else {
      console.log(`Collection "${collectionName}" already exists.`);
    }
  } catch (error) {
    console.error("Error initializing Qdrant collection:", error);
  }
};

export const checkIfArticleExists = async (url: string): Promise<boolean> => {
  try {
    const searchResult = await qdrantClient.search("news_articles", {
      vector: Array(768).fill(0), // Dummy vector (not used for filtering)
      filter: {
        must: [
          {
            key: "url",
            match: {
              value: url,
            },
          },
        ],
      },
      limit: 1,
    });

    return searchResult.length > 0;
  } catch (error) {
    console.error("Error checking for existing article:", error);
    throw error;
  }
};

export const storeArticle = async (url: string) => {
  try {
    // Check if the article already exists
    const articleExists = await checkIfArticleExists(url);
    if (articleExists) {
      console.log(`Article already exists: ${url}`);
      return;
    }
    const article = await extractContent(url);
    // Generate embedding for the article content
    const embedding = await generateEmbedding(article.content);
    const pointId = uuidv4();
    // Store the article in Qdrant
    console.log("Storing article in Qdrant:", article.url);
    await qdrantClient.upsert("news_articles", {
      points: [
        {
          id: pointId,
          vector: embedding,
          payload: {
            title: article.title,
            content: article.content,
            url: article.url,
            date: article.date,
          },
        },
      ],
    });

    console.log(`Article stored: ${article.title}`);
  } catch (error) {
    console.error("Error storing article");
    // console.error("Error storing article:", error);
  }
};

export const searchArticles = async (queryEmbedding: number[]) => {
  const searchResults = await qdrantClient.search("news_articles", {
    vector: queryEmbedding,
    limit: 3,
  });
  return searchResults;
};
