import { Kafka, Consumer } from "kafkajs";
import extractContent from "./contentExtractor";
import dotenv from "dotenv";
import { storeArticle, checkIfArticleExists } from "./qdrantClient";

dotenv.config();

const kafka = new Kafka({
  clientId: "news-article-agent",
  brokers: [process.env.KAFKA_BROKER!],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
});

const consumer = kafka.consumer({
  groupId: `${process.env.KAFKA_GROUP_ID_PREFIX}${Date.now()}`,
});

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC_NAME!,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value?.toString();
        if (messageValue) {
          try {
            const event = JSON.parse(messageValue);

            // Extract the URL from the nested structure
            const url = event.value?.url;
            if (url) {
              console.log(`Received URL: ${url}`);
              
              await storeArticle(url);
            } else {
              console.error("URL not found in the message:", event);
            }
            // Disconnect the consumer after processing the first message
            // await consumer.disconnect();
          } catch (error) {
            console.error("Error parsing Kafka message:", error);
          }
        }
      },
    });

    console.log("Kafka consumer is running.");
  } catch (error) {
    console.error("Error starting Kafka consumer:", error);
  }
};

const shutdown = async () => {
  await consumer.disconnect();
  console.log("Kafka consumer disconnected.");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
