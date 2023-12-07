import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles.notFoundPage}>
            <h2 className={styles.h2_not_found}>Ой, а такой страницы нет!</h2>
            <p className={styles.p_not_found}>Возможно, вы перешли по неверной ссылке или страница была удалена.</p>
            <Link className={styles.link} to="/">На главную</Link>
        </div>
    );
};

export default NotFoundPage;
