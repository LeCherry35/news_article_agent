import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Article } from "./interfaces";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export const cleanAndStructureContent = async (
  htmlContent: string,
  url: string
): Promise<{ title: string; content: string; url: string; date: string }> => {
  const prompt = `
    Extract and clean the following HTML content into a structured JSON format:
    - Title: Extract the main title of the article.
    - Content: Clean the main content of the article, removing ads, navigation, and irrelevant text.
    - Date: Extract the publication date if available, otherwise use the current date.

    HTML Content:
    ${htmlContent}

    Return the result in the following JSON format:
    {
      "title": "Article Title",
      "content": "Cleaned article content...",
      "date": "YYYY-MM-DD"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const structuredData = JSON.parse(cleanedText);
    structuredData.url = url;
    return structuredData;
  } catch (error) {
    console.error("Error cleaning and structuring content with Gemini:", error);
    throw error;
  }
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding with Gemini:", error);
    throw error;
  }
};

export const generateResponse = async (
  query: string,
  context: Article[]
): Promise<string> => {
  const prompt = `
    You are a helpful news assistant. Answer the user's question based on the following context:

    ${context
      .map(
        (article) => `
      Article: ${article.title}
      Content: ${article.content}
      URL: ${article.url}
      Date: ${article.date}
    `
      )
      .join("\n")}

    Question: ${query}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  return response;
};
