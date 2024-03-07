import React, {useState, useEffect} from 'react'
import { db, auth } from '../../firebase';
import App from '../../App';
import { useNavigate } from 'react-router-dom';
import { addDoc, getDocs, collection } from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import { Container, Form, Button } from 'react-bootstrap';

const AddItem = () => {
    const [IPC, setIPC] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [category, setCategory] = useState("");

    const itemsCollectionRef = collection(db, "items");
    const navigate = useNavigate();

    const addItem = async () => {
        try{
            await addDoc(itemsCollectionRef, {
                IPC: IPC, 
                Qty: quantity, 
                Description: description,
                CostEA: cost,
                Category: category
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

    // categories to choose from
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        const collectionRef1 = collection(db, "categories");
        const getList = async () => {
        try{
            const data = await getDocs(collectionRef1);
            const filteredData = data.docs.map((doc) => ({...doc.data()}));
            setItemList(filteredData);     
        }catch(error){
            console.log(error);
        }
        };
        getList();
    }, []);


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
            <Form.Control type='text' placeholder='IPC' 
                value={IPC} 
                onChange={(e) => setIPC(e.target.value)}>     
            </Form.Control>

            <Form.Control type='text' placeholder='Description' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}>     
            </Form.Control>

            <Form.Control type='number' placeholder='Cost/EA (USD)' 
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}>
            </Form.Control>

            <Form.Control type='number' placeholder='Quantity' 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}>
            </Form.Control>

            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Category</option>
                {itemList.map((item) => (
                    <option>{item.category}</option>
                ))}
            </Form.Select>
            <Button onClick={addItem}>Add Item</Button>
        </Container>
    : <App></App> }
    </Container>
  )
}

export default AddItem