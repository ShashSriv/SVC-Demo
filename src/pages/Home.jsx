import React, {useEffect, useState} from 'react'
import AuthDetails from '../components/auth/AuthDetails'
import { useNavigate } from 'react-router-dom';
import {db, auth} from '../firebase';
import { collection, doc, deleteDoc, updateDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { Button, Container, Table, Form } from 'react-bootstrap';
import {onAuthStateChanged} from 'firebase/auth';

const Home = () => {
  const navigate = useNavigate();
  const userAdd = () => {
        navigate("/addItem");
    }
  // item list
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

  // categories list
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
      const collectionRef1 = collection(db, "categories");
      const getList = async () => {
      try{
          const data = await getDocs(collectionRef1);
          const filteredData = data.docs.map((doc) => ({...doc.data()}));
          setCategoryList(filteredData);     
      }catch(error){
          console.log(error);
      }
    };
    getList();
  }, []);

  // update item
  const [editItem, setEditItem] = useState(null);
  const [editedIPC, setEditedIPC] = useState('');
  const [editedQty, setEditedQty] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCost, setEditedCost] = useState('');
  const [editedCategory, setEditedCategory] = useState('');

  const updateItem = async (id) => {
    try{
      const ref = doc(db, "items", id);
      await updateDoc(ref, {
        IPC: editedIPC
      });
      
      if (editedCost !== ''){
        await updateDoc(ref, {
          CostEA: editedCost
        });
      }
      if (editedDescription !== ''){
        await updateDoc(ref, {
          Description: editedDescription
        });
      }
      if (editedQty !== ''){
        await updateDoc(ref, {
          Qty: editedQty
        });
      }
      if (editedCategory !== ''){
        await updateDoc(ref, {
          Category: editedCategory
        });
      }
      setEditItem('');
      setEditedCost('');
      setEditedDescription('');
      setEditedQty('');
      setEditedCategory('');
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

  const generateBarcode = (item) => {
      navigate("/generateBarcode", { state: { price: item.CostEA, itemName: item.Description } });
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
          <div class="mb-2">
            <Button onClick={userAdd}>Add Item</Button>
          </div>
          <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder='Search' />
   
          <Table striped bordered hover responsive className='mt-5'>
            <thead class="text-center">
              <th>IPC</th>
              <th>Qty</th>
              <th>Description</th>
              <th>Cost/EA (USD)</th>
              <th>Category</th>
              <th></th>
            </thead>
            <tbody>
            {itemList.filter((item) => {
              return search.toLowerCase() === '' ? item : item.Description.toLowerCase().includes(search.toLowerCase());
            }).map((item) => (
              <tr key={item.id}>
                <td>{editItem === item.id ? (
                    <Form.Control type='text' value={editedIPC === '_' ? item.IPC : editedIPC} onChange={(e) => setEditedIPC(e.target.value)} />
                ) : 
                (item.IPC)}
                </td>

                <td>
                  {editItem === item.id ? (
                    <Form.Control type='number' value={editedQty === '' ? item.Qty : editedQty} onChange={(e) => setEditedQty(Number(e.target.value))} />
                  ) :
                  (item.Qty)}
                </td>

                <td>{editItem === item.id ? (
                    <Form.Control type='text' value={editedDescription === '' ? item.Description : editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                ) : 
                (item.Description)}
                </td>

                <td>
                  {editItem === item.id ? (
                    <Form.Control type='number' value={editedCost === '' ? item.CostEA : editedCost} onChange={(e) => setEditedCost(Number(e.target.value))} />
                  ) : 
                  (item.CostEA)}
                </td>

                <td>{editItem === item.id ? (
                    <Form.Select value={editedCategory === '' ? item.Category : editedCategory} onChange={(e) => setEditedCategory(e.target.value)}>
                        {categoryList.map((item1) => (
                          <option>{item1.category}</option>
                        ))}
                    </Form.Select>
                  ) : (item.Category)}
                </td>

                <td>
                  {editItem === item.id ? (
                    <div class="mb-2">
                    <Button class="btn btn-primary" style={{margin: 4}} onClick={() => {updateItem(item.id)}}>Save</Button> 
                    <Button class="btn btn-primary" style={{margin: 4}} onClick={() => {
                      setEditItem(''); 
                      setEditedIPC('_');
                      setEditedCost(''); 
                      setEditedDescription(''); 
                      setEditedQty(''); 
                      setEditedCategory('');}}>Cancel</Button>
                    </div>
                  ) : (
                    <div>
                    <Button class="btn btn-primary" style={{margin: 4}} onClick={() => {setEditItem(item.id)}}>Update</Button>
                    <Button class="btn btn-primary" style={{margin: 4}} onClick={() => {deleteItem(item.id)}}>Delete</Button>
                    <Button class="btn btn-primary" style={{margin: 4}} onClick={() => {generateBarcode(item)}}>Generate Barcode</Button>
                    </div>
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