import React from 'react';
import styles from './AuthorCard.module.css';

const AuthorCard = ({ author, isAdmin = false }) => {
    const { fullName, birthDate, gender, posts, likes, created } = author;
    const maleUrl = "https://www.mona.uwi.edu/modlang/sites/default/files/modlang/male-avatar-placeholder.png";
    const femaleUrl = "https://avatarairlines.com/wp-content/uploads/2020/05/Female-Placeholder.png";

    const formatDate = (dateTimeString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateTimeString).toLocaleString('ru-RU', options);
    };

    const getMedalColor = (position) => {
        switch (position) {
            case 1:
                return "🥇";
            case 2:
                return "🥈";
            case 3:
                return "🥉";
            default:
                return '';
        }
    };

    return (
        <div className={styles.authorCard}>
            <div className={styles.authorHeader}>
                <div className={styles.authorName}>
                    <a
                        className={styles.authorLink}
                        href={`/?author=${fullName}`}
                    >
                        {fullName}
                    </a>
                    {getMedalColor(author.position)}
                </div>
                { !isAdmin && <div className={styles.authorCreated}>
                    Создан: <span className={styles.italic}>{formatDate(created)}</span>
                </div>}
            </div>
            <div className={styles.authorDetails}>
                <div className={styles.avatar}>
                    <img className={styles.roundedImage} src={gender === 'Male' ? maleUrl : femaleUrl} alt="Avatar" />
                </div>
                { !isAdmin && <div>
                    <div>
                        День рождения: <span className={styles.bold}>{formatDate(birthDate)}</span>
                    </div>
                    <div className={styles.frameCont}>
                        Постов: <span className={styles.frame}>{posts}</span>
                    </div>
                    <div className={styles.frameCont}>
                        Лайков: <span className={styles.frame}>{likes}</span>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default AuthorCard;
