const elasticClient = require("./elasticClient");

const indexPage = async (body) => {
    try {
        await elasticClient.update({
            index: process.env.MAIN_INDEX,
            id: body.url,
            body: {
                doc: body,
                upsert: body,
            },
        });
    } catch (error) {
        if (error.statusCode === 404) {
            await elasticClient.index({
                index: process.env.MAIN_INDEX,
                id: body.url,
                body: body,
            });
        } else {
            throw error;
        }
    }
};

module.exports = indexPage;
