import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ setLoading }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuthStatus = async () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const response = await fetch('https://blog.kreosoft.space/api/account/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });

                if (response.status === 200) {
                    const userData = await response.json();
                    setUserEmail(userData.email);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    setUserEmail('');
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Ошибка при запросе профиля:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setIsLoggedIn(false);
            setUserEmail('');
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, [location.pathname, setLoading]);

    const handleLogout = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                const response = await fetch('https://blog.kreosoft.space/api/account/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });

                if (response.status === 200) {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setUserEmail('');
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1>Подвал номер 28</h1>
            </div>
            <div className="menu">
                <a href="/">Главная</a>

                {isLoggedIn ? (
                    <div>
                        <a href="/post/create">Написать пост</a>
                    </div>
                ) : (<div></div>)
                }

                <a href="/authors">Авторы</a>
                <a href="/communities">Группы</a>
            </div>
            <div className="header-right">
                {isLoggedIn ? (
                    <div className="user-menu" onClick={toggleDropdown}>
                        <span className={`email ${isDropdownOpen ? 'arrow-up' : 'arrow-down'}`}>
                            {userEmail}
                        </span>
                        {isDropdownOpen && (
                            <ul>
                                <li onClick={handleProfileClick}>Профиль</li>
                                <li onClick={handleLogout}>Выйти</li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <a href="/login">Войти</a>
                )}
            </div>
            {isDropdownOpen && <div className="overlay" onClick={closeDropdown}></div>}
        </header>
    );
};

export default Header;