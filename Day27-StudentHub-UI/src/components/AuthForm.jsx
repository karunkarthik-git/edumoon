import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useLocation } from 'react-router';
import { use, useState } from 'react';
import axios from 'axios';

const AuthForm = (props) => {
    const { isLogin } = props;
    const [input, setInput] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        bio: ''
    });

    const triggerAPI = (payload) => {
        const url = import.meta.env.VITE_SH_BE_URI + `api/v1/users/${isLogin ? 'login' : 'sign-up'}`;
        axios.post(url, payload)
            .then(response => {
                if (!isLogin && response.status === 200) {
                    alert('Sign up successful! You can now log in.');
                    window.location.href = '/login';
                } else if (response.status === 200) {
                    localStorage.setItem('token', response.data.data.token);
                    window.location.href = '/';
                }
            })
            .catch(error => {
                alert('An error occurred. Please try again.');
                console.error('API error:', error);
            });
    }

    const handleFormSubmit = (input) => {
        console.log('Form submitted with:', input);
        console.log(import.meta.env.VITE_SH_BE_URI);
        if (isLogin) {
            if (!input.email || !input.password) {
                alert('Please fill in all required fields!');
                return;
            }
            triggerAPI(input);
        } else {
            if (input.password !== input.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            if (!input.name || !input.email || !input.password) {
                alert('Please fill in all required fields!');
                return;
            }
            triggerAPI(input);
        }
    }

    return (
        <>
        <div className='container mt-5'>
            <h1 className='text-center'>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <br />
            <Form>

                {!isLogin && <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" value={input.name} onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))} />
                </Form.Group>}

                {!isLogin && <Form.Group className="mb-3" controlId="formBasicBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control type="text" placeholder="Tell us about yourself" value={input.bio} onChange={(e) => setInput((prev) => ({ ...prev, bio: e.target.value }))} />
                </Form.Group>}

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={input.email} onChange={(e) => setInput((prev) => ({ ...prev, email: e.target.value }))} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={input.password} onChange={(e) => setInput((prev) => ({ ...prev, password: e.target.value }))} />
                </Form.Group>

                {!isLogin && <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" value={input.confirmPassword} onChange={(e) => setInput((prev) => ({ ...prev, confirmPassword: e.target.value }))} />
                </Form.Group>}

                <Form.Group className="mb-3">
                    <Link to={isLogin ? '/signup' : '/login'}>
                        <Form.Text className="text-muted">
                            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
                        </Form.Text>
                    </Link>
                </Form.Group>
                
                <Button variant="primary" type="submit" onClick={(e) => {
                    e.preventDefault();
                    handleFormSubmit(input);
                    setInput({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        name: '',
                        bio: ''
                    });
                }}>
                    Submit
                </Button>
            </Form>
        </div>
        </>
    );
}

export default AuthForm;