import React, { useState } from 'react';
import { compressFile } from '../huffmanCoding';

function Compression({ goBack }) {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [notification, setNotification] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/zip') {
      setFile(selectedFile);
      setOriginalSize((selectedFile.size / 1024).toFixed(2)); 
      setNotification('');
    } else {
      setNotification('Please upload a non-ZIP file.');
    }
  };

  const handleCompress = async () => {
    if (file) {
      const { compressedData, size, huffmanTree, originalFileName, originalFileType } = await compressFile(file);
      setCompressedSize((size / 1024).toFixed(2)); 
      setCompressedFile(compressedData);
      setNotification('File converted successfully!');
      
      localStorage.setItem('huffmanTree', JSON.stringify(huffmanTree));
      localStorage.setItem('originalFileName', originalFileName);
      localStorage.setItem('originalFileType', originalFileType);
    }
  };

  const handleDownload = () => {
    if (compressedFile) {
      const blob = new Blob([compressedFile], { type: 'application/zip' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'enterFileName.zip';
      link.click();
    }
  };

  return (
    <div className="compression-container">
      <h2>Compress File</h2>
      <button onClick={goBack} className="button">{"< Back"}</button>
      <input type="file" onChange={handleFileChange} accept="*/*" />
      {file && <p>Original Size: {originalSize} KB</p>}
      <button onClick={handleCompress} className="button">Compress</button>
      {compressedFile && <p>Compressed Size: {compressedSize} KB</p>}
      {compressedFile && (
        <button onClick={handleDownload} className="button">Download File</button>
      )}
      {notification && <p className={`notification ${notification === 'Please upload a non-ZIP file.' ? 'error' : ''}`}>{notification}</p>}
    </div>
  );
}

export default Compression;
