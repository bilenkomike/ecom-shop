import React, {useState, useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button,  } from 'react-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productCostants'

function EditProductScreen({match, history}) {

    const productId = match.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountIsStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    
    const dispatch = useDispatch();


    const productDetails = useSelector(state => state.productDetails);
    const {product, error, loading} = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const {success:successUpdate, error:errorUpdate, loading:loadingUpdate} = productUpdate;


    useEffect(() => {

        if(successUpdate) {
            dispatch({type: PRODUCT_UPDATE_RESET});
            history.push('/admin/productslist')
        }
        else {
            if(!product.name || product._id !== Number(productId)) {
                dispatch(listProductDetails(productId));
            }
            else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountIsStock(product.countInStock);
                setDescription(product.description);
            }
        }
       
             

       
    },[dispatch, product,productId, history,successUpdate])

    const sumbitHandler = (e) => {
        e.preventDefault();        
        dispatch(updateProduct({_id:productId,
            name,price, image, brand, category,countInStock, description
        }))
        
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('product_id', productId);
        setUploading(true);

        try{
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            const {data} = await axios.post('/api/products/upload/', formData, config);

            setImage(data);

            setUploading(false);
        }
        catch(e) {
            setUploading(false);
        }

    }

    return (
        <div>
            <Link to="/admin/productslist">Go back</Link>
            {loadingUpdate && <Loader /> }
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            <FormContainer>
                <h1>Edit Product</h1>
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
                    
                    <Form.Group controlId='price' >
                        <Form.Label>
                            Price:
                        </Form.Label>
                        <Form.Control
                        type="number"
                        placeholder='Enter Price'
                        value={price}
                        onChange={e => setPrice(e.target.value) }
                        >
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='image' >
                        <Form.Label>
                            Image:
                        </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder='Enter image'
                        value={image}
                        onChange={e => setImage(e.target.value) }
                        >
                        </Form.Control>
                        
                        
                        <Form.Control
                        type='file'
                                    id='image-file'
                                    label='Choose File'
                                    custom='true'
                                    onChange={uploadFileHandler}
                                />

                        {uploading && <Loader />}
                        
                    </Form.Group>
                    
                    <Form.Group controlId='brand' >
                        <Form.Label>
                            Brand:
                        </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder='Enter brand'
                        value={brand}
                        onChange={e => setBrand(e.target.value) }
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock' >
                        <Form.Label>
                            Stock:
                        </Form.Label>
                        <Form.Control
                        type="number"
                        placeholder='Enter Stock'
                        value={countInStock}
                        onChange={e => setCountIsStock(e.target.value) }
                        >
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='category' >
                        <Form.Label>
                            Category:
                        </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder='Enter Category'
                        value={category}
                        onChange={e => setCategory(e.target.value) }
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description' >
                        <Form.Label>
                            Description:
                        </Form.Label>
                        <Form.Control
                        type="text"
                        placeholder='Enter description'
                        value={description}
                        onChange={e => setDescription(e.target.value) }
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary">Update</Button>
                </Form>
                    )
                }
                

            </FormContainer>
        </div>
       
    )
}

export default EditProductScreen;