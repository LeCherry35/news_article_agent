import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { startKafkaConsumer } from "./kafkaConsumer";
import { initializeQdrant, searchArticles } from "./qdrantClient";
import { generateEmbedding } from "./geminiClient";
import { generateResponseService } from "./service";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("News Article Agent is running!");
});

const agentHandler = async (req: any, res: any) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await generateResponseService(query);
    res.json(response);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
app.post('/agent', agentHandler);


startKafkaConsumer();

initializeQdrant();

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const shutdown = async () => {
  console.log('Shutting down gracefully...');

  // Close the Express server
  server.close(() => {
    console.log('Express server closed.');
  });

  // Exit the process
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);