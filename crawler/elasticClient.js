const { Client } = require("@elastic/elasticsearch");

const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTIC_ID,
    },
    auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASSWORD,
    },
});

module.exports = elasticClient;
