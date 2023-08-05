import elasticClient from "@/elasticClient";

export default async function handler(request, response) {
    try {
        if (request.method === "GET") {
            const data = await elasticClient.search({
                index: process.env.MAIN_INDEX,
                _source: false,
                body: {
                    suggest: {
                        complete: {
                            prefix: request.query.q,
                            completion: {
                                field: "suggest",
                                size: 8,
                                skip_duplicates: true,
                                fuzzy: {
                                    fuzziness: "AUTO",
                                },
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
