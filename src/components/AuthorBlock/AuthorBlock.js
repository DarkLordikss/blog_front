import React, { useEffect, useState } from 'react';
import AuthorCard from '../AuthorCard/AuthorCard';
import styles from './AuthorBlock.module.css';

const AuthorBlock = () => {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        fetch('https://blog.kreosoft.space/api/author/list')
            .then((response) => response.json())
            .then((data) => {
                const sortedAuthors = data.sort((a, b) => {
                    if (b.posts !== a.posts) {
                        return b.posts - a.posts;
                    }
                    return b.likes - a.likes;
                });

                const authorsWithPosition = sortedAuthors.map((author, index) => ({ ...author, position: index + 1 }));
                setAuthors(authorsWithPosition.sort((a, b) => a.fullName > b.fullName ? 1 : -1));
            })
            .catch((error) => console.error('Error fetching authors:', error));
    }, []);

    return (
        <div className={styles.authorBlock}>
            {authors.map((author) => (
                <AuthorCard key={author.fullName} author={author} />
            ))}
        </div>
    );
};

export default AuthorBlock;
