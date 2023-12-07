import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ totalPages, searchParams, onPageChange }) => {
    const changePage = (v) => {
        onPageChange('page', v);
    };

    const changePageSize = (v) => {
        if (isNaN(v)) {
            v = 5;
        }
        onPageChange('size', v);
    }

    return (
        <div className={styles.paginationContainer}>
            <button
                onClick={() => changePage(1)}
                disabled={parseInt(searchParams.page) === 1}
                className={styles.paginationButton}
            >
                {'<<'}
            </button>
            <button
                onClick={() => changePage(parseInt(searchParams.page) - 1)}
                disabled={parseInt(searchParams.page) === 1}
                className={styles.paginationButton}
            >
                {'<'}
            </button>
            <input
                type="text"
                value={searchParams.page}
                className={styles.paginationInput}
                onChange={e => changePage(e.target.value)}
            />
            <span>of {totalPages}</span>
            <button
                onClick={() => changePage(parseInt(searchParams.page) + 1)}
                disabled={parseInt(searchParams.page) === totalPages}
                className={styles.paginationButton}
            >
                {'>'}
            </button>
            <button
                onClick={() => changePage(parseInt(totalPages))}
                disabled={parseInt(searchParams.page) === totalPages}
                className={styles.paginationButton}
            >
                {'>>'}
            </button>
            <select
                value={parseInt(searchParams.size)} onChange={e =>
                changePageSize(e.target.value)}
                className={styles.paginationSelect}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
        </div>
    );
};

export default Pagination;
