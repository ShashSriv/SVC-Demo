import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import AuthDetails from './components/auth/AuthDetails';


function App() {
  return (
    <Container className='mt-3'>
      <AuthDetails />
    </Container>
  );
}

export default App;
