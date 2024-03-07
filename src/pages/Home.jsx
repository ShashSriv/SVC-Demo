import React, {useEffect, useState} from 'react'
import AuthDetails from '../components/auth/AuthDetails'
import { useNavigate } from 'react-router-dom';
import {db, auth} from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
import { Button, Container, Table } from 'react-bootstrap';
import {onAuthStateChanged} from 'firebase/auth';

const Home = () => {
  const navigate = useNavigate();
  const userAdd = () => {
        navigate("/addItem");
    }
  
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const itemsCollectionRef = collection(db, "items");
    const getList = async () => {
      try{
        const data = await getDocs(itemsCollectionRef);
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
          <h1 style={{textAlign:'center'}} className='mt-3'>Inventory</h1>
          <div className='position-absolute top-0 end-0'>
            <AuthDetails></AuthDetails>
          </div>
          <Button onClick={userAdd}>Add Item</Button>
          <Table striped bordered hover responsive className='mt-5'>
            <thead>
              <th>IPC</th>
              <th>Qty</th>
              <th>Description</th>
              <th>Cost/EA (USD)</th>
              <th>Category</th>
            </thead>
            <tbody>
            {itemList.map((item) => (
              <tr>
                <td>{item.IPC}</td>
                <td>{item.Qty}</td>
                <td>{item.Description}</td>
                <td>{item.CostEA}</td>
                <td>{item.Category}</td>
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