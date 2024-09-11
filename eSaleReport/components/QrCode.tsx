import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const QrCode = () => {
  return (
    <QRCode
      value={'https://www.example.com/'} // Pass the value you want to encode here
      size={100} // Adjust the size of the QR code as needed
      color='black' // Adjust the color of the QR code
      backgroundColor='white' // Adjust the background color of the QR code
    />
  );
};

export default QrCode;
