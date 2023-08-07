const pagesIndex = Object.freeze({
    index: process.env.MAIN_INDEX,
    settings: {
        analysis: {
            analyzer: {
                custom_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: ["lowercase", "alphanum_filter", "autocomplete"],
                },
            },
            filter: {
                alphanum_filter: {
                    type: "pattern_replace",
                    pattern: "[^a-zA-Z0-9]",
                    replacement: "",
                },
                autocomplete: {
                    type: "edge_ngram",
                    min_gram: 1,
                    max_gram: 20,
                },
            },
        },
    },
    mappings: {
        properties: {
            suggest: {
                type: "completion",
                // analyzer: "custom_analyzer",
                // search_analyzer: "standard",
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
