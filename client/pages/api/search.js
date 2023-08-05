import elasticClient from "@/elasticClient";

export default async function handler(request, response) {
    try {
        if (request.method === "GET") {
            const data = await elasticClient.search({
                index: process.env.MAIN_INDEX,
                _source: ["url", "origin", "title", "favicon", "description", "image"],
                body: {
                    from: request.query.page || 0,
                    size: 10,
                    query: {
                        bool: {
                            should: [
                                {
                                    multi_match: {
                                        query: request.query.q,
                                        fields: [
                                            "title",
                                            "content",
                                            "heading1",
                                            "heading2",
                                            "heading3",
                                            "paragraphs",
                                        ],
                                        type: "best_fields",
                                        fuzziness: "AUTO",
                                    },
                                },
                                {
                                    match: {
                                        description: {
                                            query: request.query.q,
                                            fuzziness: "AUTO",
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    collapse: {
                        field: "url",
                    },
                    suggest: {
                        text: request.query.q,
                        complete: {
                            text: request.query.q,
                            completion: {
                                field: "suggest",
                                size: 8,
                                skip_duplicates: true,
                                // fuzzy: {
                                //     fuzziness: "auto",
                                // },
                            },
                        },
                    },
                },
            });

            return response.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
    }
}
