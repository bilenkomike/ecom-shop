import React, {useState, useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants';


function EditUserScreen({match, history}) {

    const userId = match.params.id;

    const [name, setName] = useState('');
    const [email, setEmail]       = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    
    const dispatch = useDispatch();


    const userDetails = useSelector(state => state.userDetails);
    const {user, error, loading} = userDetails;

    const userUpdate = useSelector(state => state.userUpdate);
    const {error:errorUpdate, loading:loadingupdate, success: successUpdate} = userUpdate;


    useEffect(() => {

        if(successUpdate)  {
            dispatch({type: USER_UPDATE_RESET});
            history.push('/admin/userlist')
        }
        else {
            if(!user.name || user._id !== Number(userId)) {
                dispatch(getUserDetails(userId));
            }
            else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }

       
    },[dispatch, user,userId, successUpdate, history])

    const sumbitHandler = (e) => {
        e.preventDefault();

        dispatch(updateUser({_id:user._id, name, email, isAdmin}))
        
        
        
    }
    return (
        <div>
            <Link to="/admin/userlist">Go back</Link>
            {loadingupdate && <Loader /> }
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            <FormContainer>
                <h1>Edit User</h1>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>: 
                    (
                        
                        <Form onSubmit={sumbitHandler}>
                    <Form.Group controlId='name' >
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


                    <Form.Group controlId='email' >
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


                    <Form.Group controlId='isAdmin' >
                        <Form.Check
                        type="checkbox"
                        label='isAdmin'
                        checked={isAdmin}
                        onChange={e => setIsAdmin(e.target.checked) }
                        >
                        </Form.Check>
                    </Form.Group>
                    

                    <Button type="submit" variant="primary">Update</Button>
                </Form>
                    )
                }
                

            </FormContainer>
        </div>
       
    )
}

export default EditUserScreen;