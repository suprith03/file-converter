import React, { useState } from 'react';
import { decompressFile } from '../huffmanCoding';

function Decompression() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [decompressedSize, setDecompressedSize] = useState(0);
  const [decompressedFile, setDecompressedFile] = useState(null);
  const [notification, setNotification] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOriginalSize((selectedFile.size / 1024).toFixed(2)); 
  };

  const handleDecompress = async () => {
    if (file) {
      const huffmanTree = JSON.parse(localStorage.getItem('huffmanTree'));
      const { decompressedData, size } = await decompressFile(file, huffmanTree);
      setDecompressedSize((size / 1024).toFixed(2)); 
      setDecompressedFile(decompressedData);
      setNotification('File decompressed successfully!');
    }
  };

  const handleDownload = () => {
    if (decompressedFile) {
      const blob = new Blob([decompressedFile]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'enterFileName';
      link.click();
    }
  };

  return (
    <div className="decompression-container">
      <h2>Decompress File</h2>
      <input type="file" onChange={handleFileChange} accept=".zip" />
      {file && <p>Original Size: {originalSize} KB</p>}
      <button onClick={handleDecompress} className="button">Decompress</button>
      {decompressedFile && <p>Decompressed Size: {decompressedSize} KB</p>}
      {decompressedFile && (
        <button onClick={handleDownload} className="button">Download Decompressed File</button>
      )}
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
}

export default Decompression;
