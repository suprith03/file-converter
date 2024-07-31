import React, { useState } from 'react';
import { compressFile } from '../huffmanCoding';

function Compression() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [notification, setNotification] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOriginalSize((selectedFile.size / 1024).toFixed(2)); // KB
  };

  const handleCompress = async () => {
    if (file) {
      const { compressedData, size, huffmanTree } = await compressFile(file);
      setCompressedSize((size / 1024).toFixed(2)); // KB
      setCompressedFile(compressedData);
      setNotification('File converted successfully!');
      // Save huffmanTree for decompression
      localStorage.setItem('huffmanTree', JSON.stringify(huffmanTree));
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
      <input type="file" onChange={handleFileChange} accept="*/*" />
      {file && <p>Original Size: {originalSize} KB</p>}
      <button onClick={handleCompress} className="button">Compress</button>
      {compressedFile && <p>Compressed Size: {compressedSize} KB</p>}
      {compressedFile && (
        <button onClick={handleDownload} className="button">Download Compressed File</button>
      )}
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
}

export default Compression;
