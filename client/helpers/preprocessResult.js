export default function preprocessResult(query) {
    console.log(query);
    return query.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
}
