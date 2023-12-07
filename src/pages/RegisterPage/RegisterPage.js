import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './RegisterPage.css';
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (token) {
        navigate('/profile');
    }

    return (
        <div className="container window">
            <RegisterForm />
        </div>
    );
}

export default RegisterPage;
