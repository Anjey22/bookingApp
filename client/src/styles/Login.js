import { useState } from 'react';
import axios from 'axios';
import Loading from '../components/loading';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
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

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.post('/api/users/login', { email, password });
                console.log('Login successful', response.data);
                setLoading(false);

                localStorage.setItem('token', response.data.token); // Store token as 'token'
                window.location.href = '/home';
            } catch (error) {
                if (error.response && error.response.data.message) {
                    Swal.fire('','Invalid credentials, please try again','error');
                } else {
                    console.error('Login failed', error.response ? error.response.data : error.message);
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

    return (
        <div>
            {loading && <Loading />}
            <div className='center-container'>
                <div className="registration-form">
                    <b><h2 className='my-15px reg'>Login to your account</h2></b>
                    <form onSubmit={handleSubmit}>
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
                        <button className='Reg' type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
