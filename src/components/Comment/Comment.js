import React, {useState, useEffect} from 'react';
import styles from './Comment.module.css';
import {useNavigate} from "react-router-dom";

const Comment = ({ isRoot, comment, postId, refreshPost, userId }) => {
    const [subComments, setSubComments] = useState([]);
    const [showSubComments, setShowSubComments] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const navigate = useNavigate();

    useEffect(() => {
        if (showSubComments) {
            fetch(`https://blog.kreosoft.space/api/comment/${comment.id}/tree`)
                .then(response => response.json())
                .then(data => setSubComments(data))
                .catch(error => console.error('Error fetching sub-comments:', error));
        }
    }, [showSubComments, comment.id, refreshPost]);

    const toggleSubComments = () => {
        setShowSubComments(!showSubComments);
    };

    const handleReplyClick = () => {
        setShowReplyInput(true);
    };

    const handleEditComment = () => {
        setIsEditing(true);
    };

    const handleApplyEdit = async () => {
        try {
            const response = await fetch(`https://blog.kreosoft.space/api/comment/${comment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    content: editedContent,
                }),
            });

            if (response.status === 200) {
                setIsEditing(false);
                refreshPost();
            } else {
                console.error('Ошибка при редактировании комментария');
            }
        } catch (error) {
            console.error('Ошибка при редактировании комментария:', error);
        }
    };

    const handleReplySubmit = async () => {
        try {
            const response = await fetch(`https://blog.kreosoft.space/api/post/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    content: replyContent,
                    parentId: comment.id,
                }),
            });

            if (response.status === 200) {
                setReplyContent('');
                setShowReplyInput(false);

                if (isRoot) {
                    setShowSubComments(true);
                }

                refreshPost();
            } else {
                if (!localStorage.getItem('token')) {
                    navigate('/login');
                }
                setReplyContent('');
                setShowReplyInput(false);
                console.error('Ошибка при отправке ответа');
            }
        } catch (error) {
            console.error('Ошибка при отправке ответа:', error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const response = await fetch(`https://blog.kreosoft.space/api/comment/${comment.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.status === 200) {
                refreshPost();
            } else {
                console.error('Ошибка при удалении комментария:');
                console.log(response);
            }
        } catch (error) {
            console.error('Ошибка при удалении комментария:', error);
        }
    };

    const formatDate = (dateTimeString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateTimeString).toLocaleString('ru-RU', options);
    };

    return (
        <div className={styles.comment}>
            <div className={styles.commentHeader}>
                <div className={styles.commentAuthor}>{!comment.deleteDate ?
                    <a
                        className={styles.authorLink}
                        href={`/?author=${comment.author}`}
                    >
                        {comment.author}
                    </a> : "[ДАННЫЕ УДАЛЕНЫ]"}
            </div>
                <div className={styles.commentDate}>
                    {
                        comment.deleteDate ? formatDate(comment.deleteDate) + " (удалено)" :
                        (comment.modifiedDate ? formatDate(comment.modifiedDate) + " (изменено)" :
                        formatDate(comment.createTime))
                    }
                </div>
            </div>
            {
                (userId && userId === comment.authorId && !comment.deleteDate) &&
                (
                    <div>
                        <span className={styles.cursorPointer} onClick={handleDeleteComment}>❌</span>
                        <span className={styles.cursorPointer} onClick={handleEditComment}>✏️</span>
                    </div>
                )
            }
            <hr/>
            {isEditing ? (
                    <div className={styles.replyInputContainer}>
                        <textarea
                            className={styles.replyInput}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <button className={styles.replySubmitButton} onClick={handleApplyEdit}>
                            Применить
                        </button>
                    </div>
                ) :
                <div className={styles.commentContent}>
                    { !comment.deleteDate ? comment.content : "[ДАННЫЕ УДАЛЕНЫ]"}
                </div>}
            {comment.subComments > 0 && isRoot && (
                <span className={styles.showSubComments} onClick={toggleSubComments}>
                    {showSubComments ? 'Скрыть ответы' : 'Раскрыть ответы'}
                </span>
            )}
            {!showReplyInput && (
                <span className={styles.replyButton} onClick={handleReplyClick}>
                    Ответить
                </span>
            )}
            {showReplyInput && (
                <div className={styles.replyInputContainer}>
                    <textarea
                        className={styles.replyInput}
                        placeholder="Введите ваш ответ"
                        value={replyContent}
                        onChange={e => (setReplyContent(e.target.value))}
                    />
                    <button className={styles.replySubmitButton} onClick={handleReplySubmit}>
                        Отправить
                    </button>
                </div>
            )}
            {showSubComments && (
                <div className={styles.subComments}>
                    {subComments.map(subComment => (
                        <Comment
                            isRoot={false}
                            refreshPost={refreshPost}
                            postId={postId}
                            key={subComment.id}
                            comment={subComment}
                            userId={userId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
