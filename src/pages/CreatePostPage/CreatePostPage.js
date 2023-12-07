import React from 'react';
import PostForm from '../../components/PostForm/PostForm';
import styles from './CreatePostPage.module.css';

const CreatePostPage = () => {
    return (
        <div>
            <h1 className={styles.postHeader}>Создание поста</h1>
            <PostForm />
        </div>
    );
};

export default CreatePostPage;