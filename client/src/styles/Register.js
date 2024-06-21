// src/styles/Register.js
import { useState } from 'react';
import axios from 'axios';
import Loading from '../components/loading';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Email is not valid';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.post('/api/users/register', {
                    name,
                    email,
                    password
                });
                console.log('Registration successful', response.data);
                setLoading(false)
                Swal.fire('','Account successfully registered','success');
                
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                window.location.href = '/home';

            } catch (error) {
                if (error.response && error.response.data.message === 'Email already exists, try a different email') {
                    Swal.fire('Opps','Email already registered, try a different email or login to your account','error');
            
                } else {
                    console.error('Registration failed', error.response ? error.response.data : error.message);
                }
                setLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div>
            {loading && <Loading />}
            <div className='center-container'>
                <div className="registration-form">
                    <b><h2 className='my-15px reg'>Register your account</h2></b>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter your name'
                                required
                            />
                            {errors.name && <p className="error">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your email'
                                required
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                        <div>
                            <div className="password-input pass">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <div className='pass'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm your password'
                                required
                            />
                            <button
                                type="button"
                                className="show-password"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                        </div>
                        <button className='Reg' type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
