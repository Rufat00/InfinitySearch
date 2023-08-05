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

        while (true) {
            try {
                const linksDataset = await readDataset("links");
                const currentLink = linksDataset[linksDataset.length - 1];

                const page = await browser.newPage();
                await page.goto(currentLink);

                const { links, body } = await fetch(page);

                await page.close();
                await indexPage(body);

                linksDataset.pop();
                await writeDataset("links", [...links, ...linksDataset]);

                console.log(`"${currentLink}" have been processed`);
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
