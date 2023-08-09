require("dotenv").config();
const { readDataset, writeDataset } = require("./storage");
const elasticClient = require("./elasticClient");
const pagesIndex = require("./indices/pages");
const { Worker } = require("worker_threads");
const os = require("os");
const indexPage = require("./indexPage");

const start = async () => {
    try {
        elasticClient
            .ping()
            .then((response) => console.log("You are connected to Elasticsearch."))
            .catch((error) => {
                console.error("Elasticsearch is not connected.");
                process.exit();
            });

        await elasticClient.indices
            .exists({
                index: process.env.MAIN_INDEX,
            })
            .then((exists) => {
                if (exists) {
                    console.log(`Writing into ${process.env.MAIN_INDEX} index`);
                } else {
                    elasticClient.indices.create(pagesIndex);
                    console.log(`Creating ${process.env.MAIN_INDEX} index and writing in it`);
                }
            });
        const THREAD_COUNT = os.cpus().length;
        let limitCounter = 0;
        let allowExpandDataset = true;

        let LIMIT = process.env.LIMIT;

        if (LIMIT !== "*") {
            LIMIT = parseInt(LIMIT);
        }
        let linksDataset = await readDataset("links");

        const createFetcher = () =>
            new Promise((resolve, reject) => {
                const url = linksDataset[0];
                linksDataset.shift();

                const fetcher = new Worker("./fetcher.js", {
                    workerData: { url },
                });

                fetcher.on("message", async ({ links, body }) => {
                    if (allowExpandDataset) {
                        linksDataset = [...links, ...linksDataset];
                    }

                    await writeDataset("links", linksDataset);

                    if (body) {
                        limitCounter += 1;
                        await indexPage(body);
                    }
                    resolve();
                });

                fetcher.on("error", (error) => {
                    reject(error);
                });
            });

        process.on("exit", () => {
            console.log(
                `Exiting ${limitCounter} pages have been processed.\n More ${
                    LIMIT - limitCounter
                } pages must be processed `
            );
        });

        while (true) {
            try {
                if (linksDataset.length >= LIMIT) {
                    allowExpandDataset = false;
                }
                const workingFetchers = [];

                for (let index = 0; index < THREAD_COUNT; index++) {
                    workingFetchers.push(createFetcher());
                }
                await Promise.all(workingFetchers);

                if (limitCounter >= LIMIT) {
                    console.log(`${limitCounter} pages have been proccessed. exiting...`);
                    process.exit();
                }
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

start();
