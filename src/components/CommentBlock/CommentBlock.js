import React, {useEffect, useState} from 'react';
import Comment from '../../components/Comment/Comment';
import styles from './CommentBlock.module.css';
import {useNavigate} from "react-router-dom";

const CommentBlock = ({ comments, postId, refreshPost, toCommentBlock=false }) => {
    const [newComment, setNewComment] = useState('');
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const response = await fetch('https://blog.kreosoft.space/api/account/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const userData = await response.json();
                setUserId(userData.id);
            }
        } catch (error) {
            console.error('Ошибка при запросе профиля:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleCommentSubmit = async () => {
        try {
            const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.status === 200) {
                refreshPost();
                setNewComment("");
                console.log('Комментарий успешно отправлен');
            } else {
                if (!token) {
                    navigate('/login');
                }
                console.error('Ошибка при отправке комментария');
            }
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        }
    };

    return (
        <div>
            {comments.map(comment => (
                <Comment
                    isRoot={true}
                    key={comment.id}
                    userId={userId}
                    comment={comment}
                    postId={postId}
                    refreshPost={refreshPost} />
            ))}
            <div className={styles.commentInput}>
                <textarea
                    placeholder="Введите ваш комментарий"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
            </div>
            <div className={styles.commentInput}>
                <button onClick={handleCommentSubmit}>Отправить</button>
            </div>
        </div>
    );
};

export default CommentBlock;
