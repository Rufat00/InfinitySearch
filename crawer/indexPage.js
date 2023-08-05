const elasticClient = require("./elasticClient");

const indexPage = async (body) => {
    await elasticClient.index({
        index: process.env.MAIN_INDEX,
        body: body,
    });
};

module.exports = indexPage;
