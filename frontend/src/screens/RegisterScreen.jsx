import React, {useState, useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { register } from '../actions/userActions'
import { Link } from 'react-router-dom';
import { Form, Button,Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';


function RegisterScreen({location, history}) {
    const [name, setName] = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    

    const dispatch = useDispatch();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userRegister = useSelector(state => state.userRegister);
    const {userInfo, error, loading} = userRegister;

    useEffect(() => {
        if(userInfo) {
            history.push(redirect);
        }
    },[history, userInfo,redirect])

    const sumbitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Password do not match');
            return;
        }
        dispatch(register(name,email, password));
        
    }
    return (
        <FormContainer>
            <h1>Register</h1>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={sumbitHandler}>
                <Form.Group controlId='name' required>
                    <Form.Label>
                        Name:
                    </Form.Label>
                    <Form.Control
                    type="text"
                    placeholder='Enter Name'
                    value={name}
                    onChange={e => setName(e.target.value) }
                    >
                    </Form.Control>
                </Form.Group>


                <Form.Group controlId='email' required>
                    <Form.Label>
                        Email:
                    </Form.Label>
                    <Form.Control
                    type="email"
                    placeholder='Enter Email'
                    value={email}
                    onChange={e => setEmail(e.target.value) }
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password' required>
                    <Form.Label>
                        Password:
                    </Form.Label>
                    <Form.Control
                    type="password"
                    placeholder='Enter Password'
                    value={password}
                    onChange={e => setPassword(e.target.value) }
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword' required>
                    <Form.Label>
                        Password Confirm:
                    </Form.Label>
                    <Form.Control
                    type="password"
                    placeholder='Enter Confirm Password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value) }
                    >
                    </Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">Register</Button>
            </Form>

            <Row className="py-3">
                <Col>
                    Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : `/register`}>Sign in</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default RegisterScreen;