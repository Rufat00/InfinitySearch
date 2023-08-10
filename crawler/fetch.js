const generateShingles = require("./helper/generateShingles");

const fetch = async (page) => {
    try {
        const getMetadata = async (name) => {
            return await page.evaluate((name) => {
                const metatag =
                    document.querySelector(`meta[name="${name}"]`) ||
                    document.querySelector(`meta[name="og:${name}"]`) ||
                    document.querySelector(`meta[name="twitter:${name}"]`) ||
                    document.querySelector(`meta[property="${name}"]`) ||
                    document.querySelector(`meta[property="og:${name}"]`) ||
                    document.querySelector(`meta[property="twitter:${name}"]`);

                if (metatag) {
                    return metatag.content;
                }
                return metatag;
            }, name);
        };

        const langAttribute = await page.evaluate(() => {
            const htmlTag = document.querySelector("html");
            return htmlTag.getAttribute("lang");
        });

        if (process.env.ALLOW_LANG !== langAttribute) {
            return {
                body: null,
                links: [],
            };
        }

        const title = await page.evaluate(() => document.title);
        const favicon = await page.evaluate(() => {
            const metatag =
                document.querySelector(`link[rel="shortcut icon"]`) ||
                document.querySelector(`link[rel="icon"]`);

            if (metatag !== null && metatag.href) {
                return metatag.href;
            }
            return null;
        });
        const origin = await page.evaluate(() => window.location.origin);
        const url = await page.evaluate(() => window.location.href);
        const description = await getMetadata("description");
        const image = await getMetadata("image");

        let links = await page.$$eval("a", (ael) =>
            ael
                .filter((a) => {
                    if (a.href && a.href !== "") {
                        const link = new URL(a.href);
                        link.hash = "";

                        if (link.protocol !== "https:") {
                            return false;
                        }

                        function hasExtension(url) {
                            let parts = url.split("/"),
                                last = parts.pop();
                            return parts.length > 3 && last.indexOf(".") != -1;
                        }

                        if (hasExtension(a.href)) {
                            const extension = a.href.split(".").at(-1);

                            if (
                                extension !== "html" ||
                                extension !== "php" ||
                                extension !== "aspx"
                            ) {
                                return false;
                            }
                            return true;
                        }

                        return true;
                    }
                    return false;
                })
                .map((a) => {
                    const link = new URL(a.href);
                    link.hash = "";

                    return link.href;
                })
        );

        if (process.env.GOOGLE_NOT_INCLUDE === "true") {
            const googleDomainPattern =
                /^(https?:\/\/)?([\da-z.-]+\.)*google\.[a-z.]{2,6}(\/[\w.-]*)*\/?/;

            links = links.filter((link) => !googleDomainPattern.test(link));
        }

        const content = {
            heading1: [], //h1
            heading2: [], //h2, h3
            heading3: [], //h4, h5
            paragraphs: [], //p
        };

        const headings = await page.$$eval("h1, h2, h3, h4, h5", (elements) =>
            elements.map((el) => ({ tag: el.tagName, value: el.textContent }))
        );

        for (const heading of headings) {
            if (heading.tag === "H1") {
                content.heading1.push(heading.value);
            } else if (heading.tag === "H2" || heading.tag === "H3") {
                content.heading2.push(heading.value);
            } else if (heading.tag === "H4" || heading.tag === "H5") {
                content.heading3.push(heading.value);
            }
        }
        const paragraphs = await page.$$eval("p", (elements) =>
            elements.map((el) => el.textContent)
        );

        content.paragraphs = paragraphs;

        const suggestions = generateShingles(
            [...content.heading1, ...content.heading2, ...content.heading3].join(" "),
            4
        );

        return {
            body: {
                url,
                origin,
                title,
                favicon,
                ...content,
                description,
                image,
                suggest: suggestions,
            },
            links: links,
        };
    } catch (error) {
        console.log(error);

        return {
            body: null,
            links: [],
        };
    }
};

module.exports = fetch;
