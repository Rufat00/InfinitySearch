function generateShingles(text, n) {
    const words = text.split(/\s+/);
    const shingles = [];

    if (n <= 0 || n > words.length) {
        return words;
    }

    for (let length = n; length >= 1; length--) {
        for (let i = 0; i <= words.length - length; i++) {
            shingles.push(words.slice(i, i + length).join(" "));
        }
    }

    const pattern = /[^a-zA-Z0-9 ]/;

    return [...words, ...shingles].filter((text) => !pattern.test(text));
}

module.exports = generateShingles;
