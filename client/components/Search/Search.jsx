"use client";

import React, { useRef, useState } from "react";
import styles from "./Search.module.scss";
import useSearchHistory from "@/hooks/useSeacrhHistory";
import { Combobox } from "@headlessui/react";
import SeacrhIcon from "@/assets/icons/SearchIcon";
import axios from "axios";
import debounce from "@/helpers/debounce";
import SearchResultType from "@/enums/SearchResultType";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import CloseIcon from "@/assets/icons/CloseIcon";
import preprocessResult from "@/helpers/preprocessResult";
import isURL from "@/helpers/isUrl";

const ResultIcon = ({ type, className }) => {
    if (type === SearchResultType.HISTORY) {
        return <HistoryIcon className={className} />;
    }
    if (type === SearchResultType.COMPLETE) {
        return <SeacrhIcon className={className} />;
    }
};

const Seacrh = ({ className }) => {
    const urlParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
    );
    const [value, setValue] = useState(urlParams.has("q") ? urlParams.get("q") : "");
    const [histoty, addHistory, removeHistory] = useSearchHistory();
    const [results, setResults] = useState([
        ...histoty.slice(-8).map((histoty) => ({ type: SearchResultType.HISTORY, value: histoty })),
    ]);
    const buttonRef = useRef(null);

    const search = async (value) => {
        const { data } = await axios.get(`/api/suggest?q=${value}`);
        let options = data.suggest["complete"][0].options;
        options = options.map((option) => option.text.split("\n")[0]);

        setResults([
            ...histoty
                .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
                .slice(-9 + options.length + 1)
                .map((histoty) => ({ type: SearchResultType.HISTORY, value: histoty })),
            ...options.map((option) => ({
                type: SearchResultType.COMPLETE,
                value: preprocessResult(option),
            })),
        ]);
    };

    const handleOnChange = (event) => {
        setValue(event.target.value);
        debounce(() => search(event.target.value), 100)();
    };

    const deleteHistoty = (event, value) => {
        event.preventDefault();
        removeHistory(value);
        setResults(results.filter((result) => result.value !== value));
    };

    const handleOnSubmit = (value, page = null) => {
        const url = new URL(window.location.href + "search");
        url.searchParams.set("q", value);
        if (page) {
            url.searchParams.set("page", page);
        }

        let values = histoty.filter((item) => item === value);

        if (values.length === 0 && value !== "") {
            addHistory(value);
        }

        if (value !== "") {
            if (isURL(value)) {
                return window.location.assign(value);
            }

            return window.location.assign(url);
        }

        return handleOnSearchInputFocus();
    };

    const handleOnSearchInputFocus = () => buttonRef.current.click();

    return (
        <Combobox onChange={handleOnSubmit}>
            <div className={`${styles.search_container} ${className}`}>
                <div className={styles.input_container}>
                    <Combobox.Input
                        onFocus={handleOnSearchInputFocus}
                        className={styles.Seacrh}
                        placeholder="Search or type URL"
                        onChange={handleOnChange}
                        autoComplete="off"
                        value={value}
                    />
                    <SeacrhIcon className={styles.search_icon} />
                </div>
                <Combobox.Button style={{ display: "none" }} ref={buttonRef} />
                <div className={styles.options_container}>
                    <Combobox.Options className={styles.options}>
                        {[
                            {
                                value: value,
                                type: SearchResultType.COMPLETE,
                            },
                            ...results,
                        ].map((result, index) => (
                            <Combobox.Option key={index} value={result.value} as={"div"}>
                                {({ active }) => (
                                    <li
                                        className={`${styles.option} ${
                                            active && styles.option_activated
                                        }`}
                                    >
                                        <ResultIcon
                                            type={result.type}
                                            className={styles.option_icon}
                                        />
                                        <span>{result.value === "" ? "..." : result.value}</span>
                                        {result.type === SearchResultType.HISTORY && (
                                            <Combobox.Button
                                                className={styles.close_button}
                                                onClick={(event) =>
                                                    deleteHistoty(event, result.value)
                                                }
                                            >
                                                <CloseIcon className={styles.option_icon} />
                                            </Combobox.Button>
                                        )}
                                    </li>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </div>
        </Combobox>
    );
};

export default Seacrh;
