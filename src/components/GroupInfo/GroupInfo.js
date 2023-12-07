import React from "react";
import {useNavigate} from "react-router-dom";
import styles from './GroupInfo.module.css';
import AuthorCard from "../AuthorCard/AuthorCard";

const GroupInfo = ({ group, fetchGroup }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const createGroupPost = () => {
        navigate(`/post/create/${group.id}`)
    }

    const subscribeHandler = async (id) => {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${id}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            fetchGroup();
        } else if (response.status === 401) {
            navigate('/login');
        }
    }

    const unsubscribeHandler = async (id) => {
        const response = await fetch(`https://blog.kreosoft.space/api/community/${id}/unsubscribe`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            fetchGroup();
        } else if (response.status === 401) {
            navigate('/login');
        }
    }

    return (
        <div className={styles.groupInfoContainer}>
            <div className={styles.groupHeader}>
                <span>
                    <h2>{group.name}{group.isClosed ? "🔒" : "🔓"}</h2>
                </span>
                <span className={styles.buttonContainer}>
                    {group.role === "Administrator" && (
                        <button className={styles.createPostButton} onClick={() => createGroupPost()}>
                            Написать пост
                        </button>
                    )}
                    <span>
                        {group.role ? (
                            group.role === "Subscriber" ? (
                                <button className={styles.unsubscribeButton} onClick={() => unsubscribeHandler(group.id)}>
                                    Отписаться
                                </button>
                            ) : (
                                <div></div>
                            )
                        ) : (
                            <button className={styles.subscribeButton} onClick={() => subscribeHandler(group.id)}>
                                Подписаться
                            </button>
                        )}
                    </span>
                </span>
            </div>
            <hr className={styles.sep} />
            <div className={styles.subscribersCount}>{`Подписки: ${group.subscribersCount}`}</div>
            <hr className={styles.sep} />
            <div className={styles.administratorsList}>Администраторы:</div>
            {group.administrators.map((admin) => (
                <AuthorCard key={admin.id} author={admin} isAdmin={true} />
            ))}
        </div>
    );
}

export default GroupInfo;