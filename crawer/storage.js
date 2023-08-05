const path = require("path");
const fs = require("fs").promises;

const readDataset = async (dataset) => {
    try {
        const filePath = path.join(__dirname, "datasets", `${dataset}.json`);
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return null;
    }
};

async function writeDataset(dataset, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        const filePath = path.join(__dirname, "datasets", `${dataset}.json`);

        await fs.writeFile(filePath, jsonData, "utf8");
    } catch (error) {
        console.error("Error writing JSON file:", error);
    }
}

module.exports = { readDataset, writeDataset };
