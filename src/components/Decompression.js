import React, { useState } from 'react';
import { decompressFile } from '../huffmanCoding';

function Decompression({ goBack }) {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [decompressedSize, setDecompressedSize] = useState(0);
  const [decompressedFile, setDecompressedFile] = useState(null);
  const [notification, setNotification] = useState('');
  const [decompressedFileName, setDecompressedFileName] = useState('');
  const [decompressedFileType, setDecompressedFileType] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOriginalSize((selectedFile.size / 1024).toFixed(2)); 
  };

  const handleDecompress = async () => {
    if (file) {
      const huffmanTree = JSON.parse(localStorage.getItem('huffmanTree'));
      const { decompressedData, size, originalFileName, originalFileType } = await decompressFile(file, huffmanTree);
      setDecompressedSize((size / 1024).toFixed(2)); 
      setDecompressedFile(decompressedData);
      setNotification('File decompressed successfully!');
  
      setDecompressedFileName(originalFileName);
      setDecompressedFileType(originalFileType);
    }
  };

  const handleDownload = () => {
    if (decompressedFile) {
      const blob = new Blob([decompressedFile], { type: decompressedFileType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = decompressedFileName;
      link.click();
    }
  };

  return (
    <div className="decompression-container">
      <h2>Decompress File</h2>
      <button onClick={goBack} className="button small-button">{"< Back"}</button>
      <input type="file" onChange={handleFileChange} accept=".zip" />
      {file && <p>Original Size: {originalSize} KB</p>}
      <button onClick={handleDecompress} className="button">Decompress</button>
      {decompressedFile && <p>Decompressed Size: {decompressedSize} KB</p>}
      {decompressedFile && (
        <button onClick={handleDownload} className="button">Download File</button>
      )}
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
}

export default Decompression;
