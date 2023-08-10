require("dotenv").config();
const { readDataset, writeDataset } = require("./storage");
const elasticClient = require("./elasticClient");
const fetch = require("./fetch");
const indexPage = require("./indexPage");
const pagesIndex = require("./indices/pages");
const puppeteer = require("puppeteer");

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

        const browser = await puppeteer.launch({ headless: "new" });
        let limitCounter = 0;
        let allowExpandDataset = true;

        let LIMIT = process.env.LIMIT;

        if (LIMIT !== "*") {
            LIMIT = parseInt(LIMIT);
        }
        let linksDataset = await readDataset("links");

        process.on("exit", async () => {
            console.log(
                `Exiting ${limitCounter} pages have been processed.\n More ${
                    LIMIT - limitCounter
                } pages must be processed `
            );
        });

        while (true) {
            try {
                const currentLink = linksDataset[0];

                if (!currentLink) {
                    if (linksDataset.length <= 0) {
                        console.log("Links are over\n");
                        process.exit();
                    }
                }

                const page = await browser.newPage();
                await page.goto(currentLink);

                const { links, body } = await fetch(page);

                await page.close();
                if (body) {
                    await indexPage(body);
                    limitCounter += 1;
                }

                if (linksDataset.length >= LIMIT) {
                    allowExpandDataset = false;
                }

                linksDataset.shift();
                if (allowExpandDataset) {
                    linksDataset = [...linksDataset, ...links];
                    await writeDataset("links", linksDataset);
                }

                if (body) {
                    console.log(`"${currentLink}" have been processed`);
                } else {
                    console.log(
                        `"${currentLink}" have not been processed as it is not suits the rules`
                    );
                }

                if (limitCounter === LIMIT) {
                    await writeDataset("links", linksDataset).then(() => {
                        console.log(`${limitCounter} pages have been proccessed. exiting... \n`);
                        process.exit();
                    });
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
