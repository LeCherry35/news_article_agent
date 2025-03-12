import axios from 'axios';
import { cleanAndStructureContent } from './geminiClient';
import { Article } from './interfaces';



const extractContent = async (url: string): Promise<Article> => {
  try {
    // Fetch HTML content
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Clean and structure content using Gemini
    const structuredArticle = await cleanAndStructureContent(htmlContent, url);
    console.log("content extracted")
    return structuredArticle;
  } catch (error) {
    console.error(`Error extracting content from ${url}:`, error);
    throw error;
  }
};

export default extractContent;