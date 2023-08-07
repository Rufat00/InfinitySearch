export default function areTextsSimilar(text1, text2, threshold) {
    const minLength = Math.min(text1.length, text2.length);
    let differingCount = 0;

    for (let i = 0; i < minLength; i++) {
        if (text1[i] !== text2[i]) {
            differingCount++;
            if (differingCount >= threshold) {
                return false;
            }
        }
    }

    differingCount += Math.abs(text1.length - text2.length);
    return true;
}
