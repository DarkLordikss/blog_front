import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import './LoginPage.css';
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (token) {
        navigate('/profile');
    }

    return (
        <div className="container window">
            <LoginForm />
        </div>
    );
}

export default LoginPage;
