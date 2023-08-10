import { useEffect, useState } from "react";

const useSearchHistory = () => {
    if (typeof localStorage !== "undefined") {
        const [history, setHistory] = useState(
            localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : []
        );

        const add = (query) => {
            const newHistory = [...history, query];
            if (newHistory.length > 100) {
                newHistory.pop();
            }

            localStorage.setItem("history", JSON.stringify(newHistory));
            setHistory(newHistory);
        };

        const remove = (query) => {
            const newHistory = history.filter((value) => value !== query);

            localStorage.setItem("history", JSON.stringify(newHistory));
            setHistory(newHistory);
        };

        return [history, add, remove];
    }
};

export default useSearchHistory;
