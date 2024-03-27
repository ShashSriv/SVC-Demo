import React from 'react';
import Barcode from 'react-barcode';
import {useLocation, useNavigate} from 'react-router-dom';
import { Container } from 'react-bootstrap';


const GenerateBarcode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { price } = location.state;

    const handleGoBack = () => {
        navigate('/home');
    };

    const barcodeValue = `Price: ${price}`;

    return (
        <Container>
            <h1>Generate Barcode</h1>
            <Barcode value={barcodeValue} />
            <button onClick={handleGoBack}>Go Back</button>
        </Container>
    );
};

export default GenerateBarcode;