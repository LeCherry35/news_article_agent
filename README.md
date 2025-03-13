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
  ```
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

### Prerequisites

Node.js (v18 or higher)

Docker

Kafka credentials

Qdrant Cloud endpoint and API key (provided below)

Gemini API key

#### Clone the Repository
```
git clone https://github.com/LeCherry35/news_article_agent.git
```

#### Set Up Environment Variables:
Create a .env file as in .env example and fill the following:

KAFKA_BROKER=

KAFKA_USERNAME=

KAFKA_PASSWORD=

KAFKA_TOPIC_NAME=

KAFKA_GROUP_ID_PREFIX=

GEMINI_API_KEY=

QDRANT_API_KEY=

QDRANT_PATH=

Existing qDrant collection can be used:

ARI Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwiZXhwIjoxNzUwNDI0Njg5fQ.xpGtyilyN_AcLfRe2mvBhcD_yq4QNKUQfLncm3izsXI

Path: https://34995261-fa0a-47ef-8f25-50bb17d8db13.eu-west-2-0.aws.cloud.qdrant.io

### Docker setup
in root folder
```
docker-compose up --build
```

application is running on http://localhost:3000/

### Local setup
Steps

#### Install Dependencies:
in root folder
```
npm install
```


#### Build 
```
npm run build
```

#### Run

```
npm start
```

or in dev mode

```
npm run dev
```

application is running on http://localhost:3000/

## Test the Application:

Send a POST request to http://localhost:3000/agent with the following payload:

```json

{
  "query": "Tell me the latest news about Justin Trudeau"
}
```
You should receive a response in the specified format.
```json
  {
    "answer": "Justin Trudeau has announced he will ...",
    "sources": [
      {
        "title": "Article Title 1",
        "url": "https://…",
        "date": "YYYY-MM-DD"
      },
      {
        "title": "Article Title 2",
        "url": "https://…",
        "date": "YYYY-MM-DD"
      }
    ]
  }
  ```

## Technologies Used
Backend: Node.js, Express, TypeScript

Containerization: Docker, docker-compose

Vector Database: Qdrant Cloud

LLM Integration: Gemini API

Data Ingestion: Kafka




