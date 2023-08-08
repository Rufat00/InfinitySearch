export default function areTextsSimilar(text1, text2, threshold) {
    let differingCount = 0;

    if (text1.length > text2.length) {
        text1.slice(0, text2.length);
        differingCount += text1.length - text2.length;
    }
    if (text2.length > text1.length) {
        text2.slice(0, text1.length);
        differingCount += text2.length - text1.length;
    }

    for (let i = 0; i < text1.length; i++) {
        if (text1[i] !== text2[i]) {
            differingCount++;
            if (differingCount > threshold) {
                return false;
            }
        }
    }

    return true;
}
