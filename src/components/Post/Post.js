import React, {useState} from 'react';
import styles from './Post.module.css';
import {useNavigate} from 'react-router-dom';

const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateTimeString).toLocaleString('ru-RU', options);
};

const Post = ({ post, onAttributeChange, fetchPosts }) => {
    const [expandedPostId, setExpandedPostId] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const searchTag = (tag) => {
        navigate(`/?tags=${tag}&page=1`);

        if (onAttributeChange) {
            onAttributeChange('page', 1);
            onAttributeChange('tags', [tag]);
        }
    };

    const togglePost = (postId) => {
        setExpandedPostId((prevId) => (prevId === postId ? null : postId));
    };

    const handleLikeClick = async ({ postId, hasLike }) => {
        const url = `https://blog.kreosoft.space/api/post/${postId}/like`;

        if (token) {
            try {
                if (!hasLike) {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 200) {
                        await fetchPosts();
                    } else {
                        console.error('Error liking the post');
                    }
                } else {
                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 200) {
                        await fetchPosts();
                    } else {
                        console.error('Error unliking the post');
                    }
                }
            } catch (error) {
                console.error('Error handling like:', error);
            }
        } else {
            navigate('/login');
        }
    };

    const handleCommentClick = (postId) => {
        navigate(`/post/${postId}#comments`);
    };

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <div className={styles.postInfo}>
                    <div className={styles.author}>
                        Автор:
                        <a
                            className={styles.authorLink}
                            href={`/?author=${post.author}`}
                        >
                            {` ${post.author}`}
                        </a>
                    </div>
                    <div className={styles.community}>
                        {post.communityName && `Cообщество: ${post.communityName}`}
                    </div>
                    <div className={styles.createTime}>
                        Дата создания: {formatDate(post.createTime)}
                    </div>
                    <div className={styles.readingTime}>
                        Время чтения: {post.readingTime} мин.
                    </div>
                </div>
            </div>
            <div className={styles.postContent}>
                <div className={styles.postTitle}>
                    <a className={styles.postLink} href={`/post/${post.id}`}>{post.title}</a>
                </div>
                <hr />
                {post.image && (
                    <img className={styles.postImage} src={post.image} alt="" />
                )}
                <div className={styles.postDescription}>
                    {post.description.length > 150 ? (
                        <>
                            {expandedPostId !== post.id ? (
                                <>
                                    {post.description.slice(0, 150)}...
                                    <button
                                        className={styles.buttonPost}
                                        onClick={() => togglePost(post.id)}
                                    >
                                        Развернуть
                                    </button>
                                </>
                            ) : (
                                <>
                                {post.description}
                                    <button
                                        className={styles.buttonPost}
                                        onClick={() => togglePost(post.id)}
                                    >
                                        Свернуть
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        post.description
                    )}
                </div>
                <hr />
                <div>{`📍 ${post.address}`}</div>
                <hr />
                <div className={styles.tagsContainer}>
                    {post.tags.map((tag) => (
                        <button
                            value={tag.id}
                            key={tag.id}
                            onClick={(e) => searchTag(e.target.value)}
                            className={styles.tag}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
                <hr />
                <div className={styles.iconsContainer}>
                    <button
                        className={styles.icon}
                        onClick={() =>
                            handleLikeClick({
                                postId: post.id,
                                hasLike: post.hasLike,
                            })
                        }
                    >
                        {post.hasLike ? `❤️ ${post.likes}` : `🤍 ${post.likes}`}
                    </button>
                    <button
                        className={styles.icon}
                        onClick={() => handleCommentClick(post.id)}
                    >
                        {`💬 ${post.commentsCount}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;