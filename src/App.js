import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Home from './pages/Home';


function App() {
  return (
    <Container className='mt-3'>
      <Home />
    </Container>
  );
}

export default App;
