import React, {useState, useEffect} from 'react'
import { db, auth } from '../../firebase';
import App from '../../App';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import { Container, Form, Button } from 'react-bootstrap';

const AddItem = () => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cost, setCost] = useState("");

    const itemsCollectionRef = collection(db, "items");
    const navigate = useNavigate();

    const addItem = async () => {
        try{
            await addDoc(itemsCollectionRef, {
                name: name, 
                quantity: quantity, 
                cost: cost
            }).then(() => {
                navigate("/home");
                console.log('added item successfully!');
            }).catch((error) => {
                console.log(error);
            });
        }catch(error){
            console.log(error);
        }   
    }

    // login verification
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
        if (user){
            setAuthUser(user);
        }else{
            setAuthUser(null);
        }
        })
        return () => {
        listen();
        }
    }, []);

  return (
    <Container>
        {authUser ? 
        <Container>  
            <h1 style={{textAlign:'center'}} className='mt-3'>Add Item</h1>
            <Form.Control type='text' placeholder='Item Name' 
                value={name} 
                onChange={(e) => setName(e.target.value)}>     
            </Form.Control>

            <Form.Control type='number' placeholder='Cost (USD)' 
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}>
            </Form.Control>

            <Form.Control type='number' placeholder='Quantity' 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}>
            </Form.Control>
            <Button onClick={addItem}>Add Item</Button>
        </Container>
    : <App></App> }
    </Container>
  )
}

export default AddItem