import React, {useEffect, useState} from 'react'
import AuthDetails from '../components/auth/AuthDetails'
import { useNavigate } from 'react-router-dom';
import {db, auth} from '../firebase';
import { collection, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button, Container, Table, Form } from 'react-bootstrap';
import {onAuthStateChanged} from 'firebase/auth';

const Home = () => {
  const navigate = useNavigate();
  const userAdd = () => {
        navigate("/addItem");
    }
  
  const [itemList, setItemList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const itemsCollectionRef = collection(db, "items");
    const getList = async () => {
      try{
        onSnapshot(itemsCollectionRef, (snapshot) => {
          const filteredData = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
          setItemList(filteredData);
        });  
      }catch(error){
        console.log(error);
      }
    };

    getList();
  }, []);

  // update item
  const [editItem, setEditItem] = useState(null);
  const [editedQty, setEditedQty] = useState('');
  const [editedCost, setEditedCost] = useState('');

  const updateItem = async (id) => {
    try{
      const ref = doc(db, "items", id);
      if (editedCost !== ''){
        await updateDoc(ref, {
          CostEA: editedCost
        });
      }
      if (editedQty !== ''){
        await updateDoc(ref, {
          Qty: editedQty
        });
      }
      setEditItem('');
      setEditedCost('');
      setEditedQty('');
    }catch(error){
      console.log(error);
    }
  }

  // delete item
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
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
          <h1 style={{textAlign:'center'}} className='mt-3'>Inventory</h1>
          <div className='position-absolute top-0 end-0'>
            <AuthDetails></AuthDetails>
          </div>
          <Button onClick={userAdd}>Add Item</Button>
          <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder='Search' />
   
          <Table striped bordered hover responsive className='mt-5'>
            <thead>
              <th>IPC</th>
              <th>Qty</th>
              <th>Description</th>
              <th>Cost/EA (USD)</th>
              <th>Category</th>
              <th></th>
            </thead>
            <tbody>
            {itemList.filter((item) => {
              return search.toLowerCase() === '' ? item : item.Description.toLowerCase().includes(search);
            }).map((item) => (
              <tr key={item.id}>
                <td>{item.IPC}</td>

                <td>
                  {editItem === item.id ? (
                    <Form.Control type='number' value={editedQty === '' ? item.Qty : editedQty} onChange={(e) => setEditedQty(Number(e.target.value))} />
                  ) :
                  (item.Qty)}
                </td>

                <td>{item.Description}</td>

                <td>
                  {editItem === item.id ? (
                    <Form.Control type='number' value={editedCost === '' ? item.CostEA : editedCost} onChange={(e) => setEditedCost(Number(e.target.value))} />
                  ) : 
                  (item.CostEA)}
                </td>

                <td>{item.Category}</td>

                <td>
                  {editItem === item.id ? (
                    <>
                    <Button onClick={() => {updateItem(item.id)}}>Save</Button> {' '}
                    <Button onClick={() => {setEditItem(''); setEditedCost(''); setEditedQty('');}}>Cancel</Button>
                    </>
                  ) : (
                    <>
                    <Button onClick={() => {setEditItem(item.id)}}>Update</Button> {' '}
                    <Button onClick={() => {deleteItem(item.id)}}>Delete</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
      </Container>
    : <Container className='mt-3'><AuthDetails /> </Container>}
    </Container>
  )
}

export default Home