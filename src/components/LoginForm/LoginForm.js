import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsValidEmail(true);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleRegClick = async () => {
        navigate('/registration');
    }

    const handleLoginClick = async () => {
        if (!email || !password) {
            setIsValidEmail(false);
            return;
        }

        const isValid = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        if (!isValid(email)) {
            setIsValidEmail(false);
            return;
        }

        try {
            const response = await fetch('https://blog.kreosoft.space/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem('token', data.token);

                navigate('/');
            } else if (response.status === 400) {
                setErrorMessage('Неверный логин или пароль');
                setPassword('');
            } else {
                setErrorMessage('Что-то пошло не так');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    return (
        <div className={styles.loginForm}>
            <h2>Вход</h2>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="user@example.com"
                    onChange={handleEmailChange}
                    className={!isValidEmail ? styles.invalidInput : ''}
                />
                {!isValidEmail && <div className={styles.errorMessage}>Email некорректен</div>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password">Пароль:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="абсолютносоленый"
                    onChange={handlePasswordChange}
                />
            </div>
            <button
                className={styles.loginButton}
                onClick={handleLoginClick}
                disabled={!email || !password || !isValidEmail}
            >
                Войти
            </button>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {!email || !password ? (
                <div className={styles.errorMessage}>Заполните все поля</div>
            ) : null}
            <button onClick={handleRegClick} className={styles.registerButton}>Зарегистрироваться</button>
        </div>
    );
}

export default LoginForm;
