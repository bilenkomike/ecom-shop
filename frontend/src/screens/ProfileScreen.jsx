import React, {useState, useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { Link } from 'react-router-dom';
import { Form, Button,Row, Col } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

function ProfileScreen({history}) {
    const [name, setName] = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    

    const dispatch = useDispatch();


    const userDetails = useSelector(state => state.userDetails);
    const {user, error, loading} = userDetails;

    const userLogin = useSelector(state => state.userLogin);
    const {userInfo} = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const {success} = userUpdateProfile;

    useEffect(() => {
        if(!userInfo) {
            history.push('login/');
        }
        else {
            if(!user || !user.name || success) {
                dispatch({type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'));
            }
            else {
                
                setName(user.name);
                setEmail(user.email);
                
            }
        }
    },[history, userInfo,dispatch, user,success])

    const sumbitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Password do not match');
            
        }
        else {
            dispatch(updateUserProfile({
                'id':user._id,
                'name':name,
                'email': email,
                'password': password
            }));
            setPassword('');
            setConfirmPassword('');
            setMessage('');
        }
        // dispatch(register(name,email, password));
        
    }
  return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>


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

                <Form.Group controlId='password'>
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
                <Form.Group controlId='confirmPassword'>
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

                <Button type="submit" variant="primary">Update</Button>
            </Form>

            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
            </Col>
        </Row>
  )
}

export default ProfileScreen