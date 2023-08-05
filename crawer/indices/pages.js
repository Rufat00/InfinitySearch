const pagesIndex = Object.freeze({
    index: process.env.MAIN_INDEX,
    mappings: {
        properties: {
            suggest: {
                type: "completion",
            },
            origin: {
                type: "keyword",
            },
            url: {
                type: "keyword",
            },
            title: {
                type: "text",
            },
            favicon: {
                type: "keyword",
            },
            heading1: {
                type: "text",
            },
            heading2: {
                type: "text",
            },
            heading3: {
                type: "text",
            },
            paragraphs: {
                type: "text",
            },
            description: {
                type: "text",
            },
            image: {
                type: "keyword",
            },
        },
    },
});

module.exports = pagesIndex;
