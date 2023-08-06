"use client";

import styles from "./styles.module.scss";
import Logo from "@/components/Logo/Logo";
import Seacrh from "@/components/Search/Search";
import axios from "axios";
import { useEffect, useState } from "react";
import noFaveicon from "@/assets/images/no_faveicon.png";
import Image from "next/image";
import preprocessResult from "@/helpers/preprocessResult";

const SearchPage = () => {
    const [data, setData] = useState([]);
    const [suggest, setSuggest] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const url = new URL(window.location.origin + "/api/search");
        const urlParams = new URLSearchParams(window.location.search);

        url.searchParams.set("q", urlParams.get("q"));
        if (urlParams.has("page")) {
            url.searchParams.set("page", urlParams.get("page"));
        }

        axios
            .get(url)
            .then(({ data }) => {
                setData(data.hits.hits);
                const suggestOptions = data.suggest.complete[0].options;

                if (suggestOptions.length !== 0) {
                    const urlParams = new URLSearchParams(window.location.search);

                    if (
                        preprocessResult(suggestOptions[0].text) !==
                        preprocessResult(urlParams.get("q"))
                    ) {
                        const suggestUrl = new URL(window.location.origin + "/search");
                        suggestUrl.searchParams.set("q", suggestOptions[0].text);

                        setSuggest({ text: suggestOptions[0].text, url: suggestUrl });
                    }
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main>
            <header className={styles.header}>
                <Logo className={styles.logo} /> <Seacrh className={styles.search} />
            </header>
            <section className={styles.section}>
                {suggest && (
                    <div className={styles.suggest}>
                        Perhaps you meant: <a href={suggest.url}>{suggest.text}</a>
                    </div>
                )}

                {loading &&
                    Array.from(Array(10).keys()).map((element) => (
                        <div key={element} className={styles.skeleton}>
                            <div className={styles.skeleton_header}>
                                <div className={styles.skeleton_favicon} />
                                <div className={styles.skeleton_title} />
                            </div>
                            <div className={styles.skeleton_body} />
                        </div>
                    ))}

                {data.length !== 0 && !loading ? (
                    data.map(({ _source }) => (
                        <div className={styles.page} key={_source.url}>
                            <div className={styles.body}>
                                <a href={_source.url}>
                                    <div className={styles.head}>
                                        {_source.favicon ? (
                                            <img
                                                xSrc={_source.favicon}
                                                alt="favicon"
                                                src={_source.favicon}
                                                className={styles.favicon}
                                            />
                                        ) : (
                                            <Image
                                                alt="favicon"
                                                src={noFaveicon}
                                                className={styles.favicon}
                                            />
                                        )}
                                        <div className={styles.links}>
                                            <p className={styles.origin}>
                                                {_source.origin && _source.origin}
                                            </p>
                                            <p className={styles.url}>
                                                {_source.url && _source.url}
                                            </p>
                                        </div>
                                    </div>
                                </a>

                                <div className={styles.info}>
                                    <a href={_source.url}>
                                        <p className={styles.title}>{_source.title}</p>
                                    </a>
                                    <p className={styles.description}>{_source.description}</p>
                                </div>
                            </div>
                            {_source.image && (
                                <img alt="image" src={_source.image} className={styles.image} />
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.nothing_found}>
                        Nothing Found. <a href="/">Homepage</a>
                    </div>
                )}
            </section>
        </main>
    );
};
export default SearchPage;
