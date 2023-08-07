export default function preprocessResult(query) {
    return query
        .replace(/[ ]+$/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}
