import React from 'react';
import Container from 'react-bootstrap/Container';
import AuthDetails from './components/auth/AuthDetails';

function App() {
  return (
    <Container style={{textAlign:'center'}} className='mt-3'>
      <AuthDetails />
    </Container>
  );
}

export default App;
