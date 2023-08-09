const { workerData, parentPort } = require("worker_threads");
const fetch = require("./fetch");
const puppeteer = require("puppeteer");

const runFetcher = async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const currentLink = workerData.url;

    await page.goto(currentLink);
    const { links, body } = await fetch(page);
    await browser.close();

    if (body) {
        console.log(`"${currentLink}" have been processed`);
    } else {
        console.log(`"${currentLink}" have not been processed as it is not suits the rules`);
    }

    return { links, body };
};

runFetcher()
    .then((data) => parentPort.postMessage(data))
    .catch((error) => parentPort.close());
