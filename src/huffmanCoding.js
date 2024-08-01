class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

const buildFrequencyTable = (str) => {
  const freq = {};
  for (const char of str) {
    if (freq[char]) {
      freq[char]++;
    } else {
      freq[char] = 1;
    }
  }
  return freq;
};

const buildHuffmanTree = (freq) => {
  const nodes = Object.keys(freq).map((char) => new HuffmanNode(char, freq[char]));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const newNode = new HuffmanNode(null, left.freq + right.freq);
    newNode.left = left;
    newNode.right = right;
    nodes.push(newNode);
  }
  return nodes[0];
};

const buildCodeTable = (root) => {
  const codeTable = {};
  const buildCode = (node, code) => {
    if (node.char !== null) {
      codeTable[node.char] = code;
      return;
    }
    buildCode(node.left, code + '0');
    buildCode(node.right, code + '1');
  };
  buildCode(root, '');
  return codeTable;
};

const encode = (str, codeTable) => {
  let result = '';
  for (const char of str) {
    result += codeTable[char];
  }
  return result;
};

const decode = (encodedStr, root) => {
  let result = '';
  let currentNode = root;
  for (const bit of encodedStr) {
    if (bit === '0') {
      currentNode = currentNode.left;
    } else {
      currentNode = currentNode.right;
    }
    if (currentNode.char !== null) {
      result += currentNode.char;
      currentNode = root;
    }
  }
  return result;
};

const compressFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const freqTable = buildFrequencyTable(text);
      const huffmanTree = buildHuffmanTree(freqTable);
      const codeTable = buildCodeTable(huffmanTree);
      const encodedText = encode(text, codeTable);

      const compressedData = new Uint8Array(Math.ceil(encodedText.length / 8));
      for (let i = 0; i < encodedText.length; i++) {
        const byteIndex = Math.floor(i / 8);
        compressedData[byteIndex] = compressedData[byteIndex] < 1 | (encodedText[i] === '1' ? 1 : 0);
      }

      resolve({
        compressedData,
        size: compressedData.length,
        huffmanTree,
        originalFileName: file.name,
        originalFileType: file.type
      });
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const decompressFile = (file, huffmanTree) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryData = new Uint8Array(event.target.result);
      let binaryStr = '';
      for (const byte of binaryData) {
        binaryStr += byte.toString(2).padStart(8, '0');
      }
      const decodedText = decode(binaryStr, huffmanTree);
      resolve({
        decompressedData: decodedText,
        size: decodedText.length,
        originalFileName: localStorage.getItem('originalFileName'),
        originalFileType: localStorage.getItem('originalFileType')
      });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export { compressFile, decompressFile };
