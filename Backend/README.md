# Backend Documentation

This document provides details about the backend services, setup, and API endpoints.

## AI Chatbot Integration

This section details the AI-powered chatbot feature that generates tweet suggestions based on user prompts and existing tweet data.

### 1. Environment Variable

Ensure the following environment variable is set in your `.env` file:

-   **`GEMINI_API_KEY`**: This API key is required for interacting with the Google Gemini models. It is used for both generating embeddings (to understand the semantic meaning of tweets) and for generating the actual tweet content.

### 2. Data Ingestion Script

The data ingestion script is responsible for processing existing tweets from the MongoDB database, generating embeddings for them, and storing these embeddings in ChromaDB. This allows the AI to find relevant context when generating new tweets.

-   **Script Path:** `Backend/src/scripts/runIngestion.ts`
-   **Purpose:** To populate the ChromaDB vector store with tweet embeddings.
-   **Prerequisites:**
    1.  MongoDB server must be running and accessible.
    2.  ChromaDB instance must be running and accessible (see ChromaDB Setup below).
    3.  The `GEMINI_API_KEY` must be correctly set in your `.env` file.
-   **Command to Run:**
    Navigate to the `Backend` directory and execute:
    ```bash
    npx tsx src/scripts/runIngestion.ts
    ```
    Alternatively, if you have `tsx` installed globally or as a project alias:
    ```bash
    tsx src/scripts/runIngestion.ts
    ```
    This script will connect to MongoDB, fetch tweets, generate embeddings via the Gemini API, and store them in ChromaDB.

### 3. Chatbot API Endpoint

This endpoint allows authenticated users to generate tweet suggestions.

-   **Method:** `POST`
-   **Path:** `/api/v1/ai/generate-tweet`
-   **Authentication:** Required (JWT Bearer Token in Authorization header).
-   **Request Body:**
    The request body must be a JSON object containing the user's prompt.
    ```json
    {
      "prompt": "Your tweet idea or topic"
    }
    ```
-   **Success Response (200 OK):**
    The response will be a JSON object containing the AI-generated tweet.
    ```json
    {
      "status": 200,
      "data": {
        "tweet": "This is an AI-generated tweet based on your prompt and relevant context from existing tweets."
      },
      "message": "Tweet generated successfully."
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: If the prompt is missing or invalid.
    -   `401 Unauthorized`: If the JWT token is missing or invalid.
    -   `500 Internal Server Error`: If there's an issue generating the tweet (e.g., AI service error, ChromaDB issue).

### 4. ChromaDB Setup (Local Development)

ChromaDB is used as the vector database to store and query tweet embeddings. For local development, the easiest way to get a ChromaDB instance running is by using Docker:

1.  **Pull the ChromaDB Docker image:**
    ```bash
    docker pull chromadb/chroma
    ```
2.  **Run the ChromaDB container:**
    ```bash
    docker run -p 8000:8000 chromadb/chroma
    ```
    This will start a ChromaDB instance accessible at `http://localhost:8000`. The services in this backend are configured to connect to this default address.

---

*For other backend setup instructions (MongoDB, general dependencies, etc.), please refer to the main project documentation or relevant setup guides.*
