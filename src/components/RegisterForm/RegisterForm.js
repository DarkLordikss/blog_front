import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isInvalidName, setIsInvalidName] = useState(false);
    const [isInvalidPhone, setIsInvalidPhone] = useState(false);
    const [isInvalidDate, setIsInvalidDate] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [isEmptyField, setIsEmptyField] = useState(false);

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
        setIsInvalidName(false);
        setIsEmptyField(false);
    };

    const handleBirthDateChange = (event) => {
        setBirthDate(event.target.value);
        setIsEmptyField(false);
        setIsInvalidDate(false);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
        setIsEmptyField(false);
        setIsInvalidPhone(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsValidEmail(true);
        setIsExistingUser(false);
        setIsEmptyField(false);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setIsEmptyField(false);
        setIsInvalidPassword(false);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
        setIsEmptyField(false);
    }

    const validateFields = () => {
        if (!fullName || !birthDate || !phoneNumber || !email || !password || !gender) {
            setIsEmptyField(true);
            return false;
        }

        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        if (!nameRegex.test(fullName)) {
            setIsInvalidName(true);
            return false;
        }

        const currentDate = new Date();
        const selectedDate = new Date(birthDate);
        if (selectedDate > currentDate) {
            setIsInvalidDate(true);
            return false;
        }

        const phoneRegex = /^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setIsInvalidPhone(true);
            return false;
        }

        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setIsInvalidPassword(true);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setIsValidEmail(false);
            return false;
        }


        return true;
    };

    const handleRegistrationClick = async () => {
        if (!validateFields()) {
            return;
        }

        try {
            const response = await fetch('https://blog.kreosoft.space/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    gender,
                    birthDate,
                    phoneNumber,
                    email,
                    password,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();

                localStorage.setItem('token', data.token);
                navigate('/');
            } else if (response.status === 400) {
                setIsExistingUser(true);
            } else {
                console.error('Что-то пошло не так при регистрации');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    return (
        <div className={styles.registrationForm}>
            <h2>Регистрация</h2>
            <div className={styles.formGroup}>
                <label htmlFor="fullName">ФИО:</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    placeholder="Гегельман Роммель Топлевич"
                    className={isInvalidName ? styles.invalidInput : ''}
                    onChange={handleFullNameChange}
                />
            </div>
            {isInvalidName && <div className={styles.errorMessage}>Имя некорректно</div>}
            <div className={styles.formGroup}>
                <label htmlFor="gender">Пол:</label>
                <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={handleGenderChange}
                >
                    <option value="" disabled>
                        Выберите пол
                    </option>
                    <option value="Male">Мужской</option>
                    <option value="Female">Женский</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="birthDate">Дата рождения:</label>
                <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={birthDate}
                    placeholder="03.04.1942"
                    className={isInvalidDate ? styles.invalidInput : ''}
                    onChange={handleBirthDateChange}
                />
            </div>
            {isInvalidDate && <div className={styles.errorMessage}>Дата некорректна</div>}
            <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Телефон:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className={isInvalidPhone ? styles.invalidInput : ''}
                    placeholder="+7 (xxx) xx xx-xx"
                />
            </div>
            {isInvalidPhone && <div className={styles.errorMessage}>Номер некорректен</div>}
            <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="user@example.com"
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
                    className={isInvalidPassword ? styles.invalidInput : ''}
                    onChange={handlePasswordChange}
                />
            </div>
            {isInvalidPassword && <div className={styles.errorMessage}>Минимум 8 символов и 1 цифра</div>}
            <button
                className={styles.registerButton}
                onClick={handleRegistrationClick}
                disabled={!email || !password || !isValidEmail}
            >
                Зарегистрироваться
            </button>
            {isEmptyField && <div className={styles.errorMessage}>Заполните все поля</div>}
            {isExistingUser && (
                <div className={styles.errorMessage}>Пользователь уже существует</div>
            )}
        </div>
    );
};

export default RegistrationForm;
