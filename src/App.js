import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, {useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';


function App() {
  const navigate = useNavigate();
  useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
          if (user){
              navigate("/home");
          }else{
              navigate("/login");
          }
      })
      return () => {
          listen();
      }
  });

  return (
    <Container>
      <LoginPage></LoginPage>
    </Container>
  );
}

export default App;
