import { usePagination } from "@/hooks/usePagination";
import styles from "./Pagination.module.scss";

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
}) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });

    if (paginationRange.length < 2) {
        return null;
    }

    currentPage = parseInt(currentPage);

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <ul className={`${styles.pagination_container} ${className}`}>
            <li
                className={`${styles.pagination_item} ${currentPage === 1 ? styles.disabled : ""}`}
                onClick={onPrevious}
            >
                <div className={`${styles.arrow} ${styles.left}`} />
            </li>
            {paginationRange.map((pageNumber) => {
                if (pageNumber === "...") {
                    return <li className={`${styles.pagination_item} ${styles.dots}`}>&#8230;</li>;
                }

                return (
                    <li
                        className={`${styles.pagination_item} ${
                            currentPage === pageNumber ? styles.selected : ""
                        }`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                className={`${styles.pagination_item} ${
                    currentPage === lastPage ? styles.disabled : ""
                }`}
                onClick={onNext}
            >
                <div className={`${styles.arrow} ${styles.right}`} />
            </li>
        </ul>
    );
};

export default Pagination;
