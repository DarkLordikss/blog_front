import React, { useState, useEffect } from 'react';
import styles from './ProfileForm.module.css';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isInvalidName, setIsInvalidName] = useState(false);
    const [isInvalidPhone, setIsInvalidPhone] = useState(false);
    const [isInvalidDate, setIsInvalidDate] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [isEmptyField, setIsEmptyField] = useState(false);
    const [isSucsess, setIsSucsess] = useState(false);

    useEffect(() => {
            const fetchProfile = async () => {
                try {
                    const storedToken = localStorage.getItem('token');
                    const response = await fetch('https://blog.kreosoft.space/api/account/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                        },
                    });

                    if (response.status === 200) {
                        const userData = await response.json();
                        setFullName(userData.fullName || '');
                        setBirthDate(formatDate(userData.birthDate) || '');
                        setPhoneNumber(userData.phoneNumber || '');
                        setEmail(userData.email || '');
                        setGender(userData.gender || '');
                    } else if (response.status === 401) {
                        navigate('/login');
                    }
                } catch (error) {
                    console.error('Ошибка при запросе профиля:', error);
                }
            };

            fetchProfile();
        },
        [navigate]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('eu-EU', options).replaceAll("/", "-");
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
        setIsInvalidName(false);
        setIsEmptyField(false);
        setIsSucsess(false);
    };

    const handleBirthDateChange = (event) => {
        setBirthDate(event.target.value);
        setIsEmptyField(false);
        setIsInvalidDate(false);
        setIsSucsess(false);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
        setIsEmptyField(false);
        setIsInvalidPhone(false);
        setIsSucsess(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsValidEmail(true);
        setIsExistingUser(false);
        setIsEmptyField(false);
        setIsSucsess(false);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
        setIsEmptyField(false);
        setIsSucsess(false);
    }

    const validateFields = () => {
        if (!fullName || !birthDate || !phoneNumber || !email|| !gender) {
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setIsValidEmail(false);
            return false;
        }

        return true;
    };

    const handleSaveClick = async () => {
        if (!validateFields()) {
            return;
        }

        try {
            const storedToken = localStorage.getItem('token');
            const response = await fetch('https://blog.kreosoft.space/api/account/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
                },
                body: JSON.stringify({
                    fullName,
                    gender,
                    birthDate,
                    phoneNumber,
                    email,
                }),
            });

            if (response.status === 200) {
                console.log('Профиль успешно сохранен');
                setIsSucsess(true);
            } else if (response.status === 401) {
                navigate('/');
            } else if (response.status === 400) {
                setIsExistingUser(true);
            } else {
                console.error('Что-то пошло не так при сохранении профиля');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    return (
        <div className={styles.profileForm}>
            <h2>Профиль</h2>
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
            <button
                className={styles.saveButton}
                onClick={handleSaveClick}
            >
                Сохранить
            </button>
            {isEmptyField && <div className={styles.errorMessage}>Заполните все поля</div>}
            {isExistingUser && (
                <div className={styles.errorMessage}>Email уже занят</div>
            )}
            {isSucsess && (
                <div className={styles.sucsessMessage}>Успешно!</div>
            )}
        </div>
    );
};

export default ProfileForm;
