# Infinity Search

Infinity Search is a powerful and customizable search engine designed to efficiently index and retrieve data. It employs Elasticsearch for seamless search operations and data indexing. For a comprehensive understanding of its inner workings, check out our guide: [An In-depth Exploration of Search Engine Operations](./An_In_depth_Exploration_of_Search_Engine_Operations.pdf).

## Getting Started

Follow these steps to set up and run Infinity Search:

### Build and Run the Client:

1. Install the necessary dependencies:

    ```sh
    npm install
    ```

2. Build the project:

    ```sh
    npm run build
    ```

3. Start the application:
    ```sh
    npm start
    ```

### Environment Variables

Ensure to set the following environment variables in your system:

-   `ELASTIC_USER`: Elastic User
-   `ELASTIC_ID`: (Your Elastic ID)
-   `ELASTIC_PASSWORD`: (Your Elastic Password)
-   `MAIN_INDEX`: Index where your pages are indexed; it must match your crawler's index

## Crawler Setup

To utilize the crawler functionality, follow these steps:

1. Create a `datasets/links.json` file in the root directory of your crawler.
2. Add links to be crawled in the following format:

    ```json
    ["https://example.com", ...]
    ```

3. Install the required dependencies:

    ```sh
    npm install
    ```

4. Start the crawler:
    ```sh
    npm start
    ```

### Crawler Environment Variables

Set the following environment variables:

-   `ELASTIC_USER`: (Your Elastic User)
-   `ELASTIC_ID`: (Your Elastic ID)
-   `ELASTIC_PASSWORD`: (Your Elastic Password)
-   `MAIN_INDEX`: Index where your pages are indexed
-   `LIMIT`: Amount of links to process (use "\*" for infinite)
-   `GOOGLE_NOT_INCLUDE`: Exclude Google pages (true or false)
-   `ALLOW_LANG`: Process pages only in specific languages (e.g., ["en-US", "en"])

## Extension Usage

If you're using the Infinity Search extension:

1. Replace the iframe link with your own or use mine.
2. Load the extension into Chrome.

## About the Creator

Infinity Search was created with passion by Rufat.

Feel free to reach out with any questions or suggestions!
