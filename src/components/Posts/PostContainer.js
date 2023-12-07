import React from 'react';
import Post from '../Post/Post';
import styles from './PostContainer.module.css';

const PostContainer = ({ posts, onAttributeChange, fetchPosts }) => {
    return (
        <div className={styles.postsContainer}>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        onAttributeChange={onAttributeChange}
                        fetchPosts={fetchPosts}
                    />
                ))
            ) : (
                <p>Ничего не нашли...</p>
            )}
        </div>
    );
};

export default PostContainer;