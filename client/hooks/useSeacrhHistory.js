import { useEffect, useState } from "react";

const useSearchHistory = () => {
    let storage;
    if (typeof localStorage !== "undefined") {
        storage = localStorage;
    }
    const [history, setHistory] = useState(
        storage.getItem("history") ? JSON.parse(storage.getItem("history")) : []
    );

    const add = (query) => {
        const newHistory = [...history, query];
        if (newHistory.length > 100) {
            newHistory.pop();
        }

        storage.setItem("history", JSON.stringify(newHistory));
        setHistory(newHistory);
    };

    const remove = (query) => {
        const newHistory = history.filter((value) => value !== query);

        storage.setItem("history", JSON.stringify(newHistory));
        setHistory(newHistory);
    };

    return [history, add, remove];
};

export default useSearchHistory;
