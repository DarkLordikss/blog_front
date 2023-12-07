import React from 'react';
import styles from './GroupCard.module.css';
import {useNavigate} from "react-router-dom";

const GroupCard = ({ group, fetchGroups }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const groupButton = (text, style, handler, id) => {
        return (
            <button className={style} onClick={() => handler(id)}>
                {text}
            </button>
        );
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
            fetchGroups();
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
            fetchGroups();
        } else if (response.status === 401) {
            navigate('/login');
        }
    }

    return (
        <div className={styles.groupCard}>
            <span>
                <a href={`/communities/${group.id}`} className={styles.groupLink}>
                    <h2>{group.name}{group.isClosed ? "🔒" : "🔓"}</h2>
                </a>
            </span>
            <span>
                {group.role ? (group.role === "Subscriber" ?
                        groupButton("👤❌", styles.unsubscribeButton, unsubscribeHandler, group.id) :
                        <div></div>) :
                    groupButton("👤✔", styles.subscribeButton, subscribeHandler, group.id)}
            </span>
        </div>
    );
}

export default GroupCard;