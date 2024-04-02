import React, {useState, useEffect} from 'react'
import { db, auth } from '../../firebase';
import AuthDetails from '../auth/AuthDetails';
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
            if (IPC !== '' || quantity !== '' || description !== '' || cost !== '' || category !== ''){
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
            }else{
                navigate("/home");
            }
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
    <div className='background'>
        {authUser ? 
        <Container className='add-box'>  
            <div class="container py-4 px-5 px-md-5 mb-3">
                <div class="text-center mb-4">
                    <h1>Add Item</h1>
                </div>
                <div class="row gx-5 justify-content-center">
                    <div>
                        <div class="form-floating mb-3">
                            <Form.Control type='text' id='IPC' placeholder='IPC' 
                                value={IPC} 
                                onChange={(e) => setIPC(e.target.value)}>     
                            </Form.Control>
                            <label class="form-label text-black" for="IPC">IPC</label>
                        </div>
                        <div class="form-floating mb-3">
                            <Form.Control type='text' id='description' placeholder='Description' 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}>     
                            </Form.Control>
                            <label class="form-label text-black" for="description">Description</label>
                        </div>
                        <div class="form-floating mb-3">
                            <Form.Control type='number' id='cost' placeholder='Cost/EA (USD)' 
                                value={cost}
                                onChange={(e) => setCost(Number(e.target.value))}>
                            </Form.Control>
                            <label class="form-label text-black" for="cost">Cost/EA</label>
                        </div>
                        <div class="form-floating mb-3">
                            <Form.Control type='number' id='quantity' placeholder='Quantity' 
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}>
                            </Form.Control>
                            <label class="form-label text-black" for="quantity">Quantity</label>
                        </div>
                        <div class="form-floating mb-3">
                            <Form.Select id='category' value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option>null</option>
                                {itemList.map((item) => (
                                    <option>{item.category}</option>
                                ))}
                            </Form.Select>
                            <label class="form-label text-black" for="category">Category</label>
                        </div>
                        <div class="form-floating mb-3">
                            <Button onClick={addItem}>Add Item</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    : <Container className='mt-3'><AuthDetails /> </Container> }
    </div>
  )
}

export default AddItem