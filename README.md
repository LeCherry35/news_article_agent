# News Article Agent
The News Article Agent is a Node.js-based query-response application that integrates with a large language model (LLM) and uses a vector database (Qdrant) for Retrieval-Augmented Generation (RAG). It ingests news article links, extracts and cleans their content, and answers user queries based on the stored data.

## Features Implemented
### 1. Data Ingestion
Kafka Integration:
Ingest news article links in real-time using Kafka.

Content Extraction:
Use Gemini LLM to extract and clean article content from links.

### 2. Vector Database Setup
Qdrant Integration:
Store cleaned article content and embeddings in Qdrant.
Perform similarity searches to retrieve relevant articles for user queries.

### 3. Query-Response Interface
POST Endpoint (/agent):

Accept user queries in JSON format:

```json
{
  "query": "User query here"
}
```
- Generate embeddings for queries using Gemini.
- Retrieve relevant articles from Qdrant using similarity search.
- Generate responses using Gemini and return them in the following format:
  ```json
  {
    "answer": "An answer from LLM example",
    "sources": [
      {
        "title": "Article Title",
        "url": "https://…",
        "date": "YYYY-MM-DD"
      }
    ]
  }
Link Queries:

If the query contains a new link, extract and clean the content from the link using Gemini and saves it to database.
Use the extracted content to generate a response.

## Possible optimizations
Caching:
Use node-cache to cache query results and reduce latency.

Chunking:
Split large articles into smaller chunks for better retrieval accuracy.

Cost/Token Optimization:
Limit context length and use smaller models for simpler queries.

Response Streaming:
Use Server-Sent Events (SSE) to stream responses for a better user experience.

Langfuse Integration:
Monitor and debug LLM interactions using Langfuse.

Advanced Query Handling
Implement multi-turn conversations to handle follow-up questions.
Add support for complex queries (e.g., comparisons, summarization of multiple articles).

## Setup Instructions

### Local setup
Steps
1.Clone the Repository
```
git clone
```
2.Install Dependencies:
in root folder
```
npm install
```
3.Set Up Environment Variables:
Create a .env file as in .env example and fill the following:
KAFKA_BROKER=

KAFKA_USERNAME=

KAFKA_PASSWORD=

KAFKA_TOPIC_NAME=

KAFKA_GROUP_ID_PREFIX=

GEMINI_API_KEY=

QDRANT_API_KEY=

QDRANT_PATH=

4.Build 
```
npm run build
```

5.Run

```
npm start
```

or in dev mode

```
npm run dev
```

Using Docker: !In progress

```
docker-compose up --build
```


## Test the Application:

Send a POST request to http://localhost:3000/agent with the following payload:

```json

{
  "query": "Tell me the latest news about Justin Trudeau"
}
```
You should receive a response in the specified format.

## Technologies Used
Backend: Node.js, Express, TypeScript

Vector Database: Qdrant Cloud

LLM Integration: Gemini API

Data Ingestion: Kafka


