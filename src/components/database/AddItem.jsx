import React, {useState} from 'react'
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
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
  return (
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
  )
}

export default AddItem