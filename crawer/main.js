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

        while (true) {
            try {
                const linksDataset = await readDataset("links");
                const currentLink = linksDataset[linksDataset.length - 1];

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

                linksDataset.pop();
                if (allowExpandDataset) {
                    await writeDataset("links", [...links, ...linksDataset]);
                } else {
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
                    console.log(`${limitCounter} pages have been proccessed. exiting...`);
                    process.exit();
                }
            } catch (error) {
                console.log(error);
            }
        }

        await browser.close();
    } catch (error) {
        console.log(error);
    }
};

start();
