// playfair.js - Updated to handle spaces in keyword and format output

function generateMatrix(key) {
  // Rule: Ignore spaces in keyword, convert to uppercase, replace J with I
  key = key.toUpperCase().replace(/\s+/g, "").replace(/J/g, 'I');
  const matrix = [];
  const used = {};

  // Build the initial sequence from the processed key and alphabet
  const sequence = key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

  for (const c of sequence) {
    // Add unique characters (A-Z, excluding J) to the matrix list
    if (!used[c] && c >= 'A' && c <= 'Z' && c !== 'J') {
      matrix.push(c);
      used[c] = true;
    }
  }

  // Convert the flat list into a 5x5 grid
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push(matrix.slice(i * 5, i * 5 + 5));
  }

  return grid;
}

function findPos(matrix, c) {
  // Find the row and column of a character in the matrix
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === c) {
        return [i, j];
      }
    }
  }
  console.error(`Character ${c} not found in Playfair matrix.`);
  return [-1, -1];
}

// Helper function to prepare plaintext
function prepareText(text) {
  let prepared = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let result = '';

  for (let i = 0; i < prepared.length; i++) {
    result += prepared[i];
    if (i + 1 < prepared.length) {
      if (prepared[i] === prepared[i + 1]) {
        result += 'X'; // Insert X between identical letters
      }
    }
  }

  if (result.length % 2 !== 0) {
    result += 'X';
  }

  return result;
}

export function playfairEncrypt(text, key) {
  const matrix = generateMatrix(key);
  const preparedText = prepareText(text);
  let ciphertext = '';

  for (let i = 0; i < preparedText.length; i += 2) {
    const a = preparedText[i];
    const b = preparedText[i + 1];

    const [r1, c1] = findPos(matrix, a);
    const [r2, c2] = findPos(matrix, b);

    if (r1 === -1 || r2 === -1) continue;

    let ciphA, ciphB;
    if (r1 === r2) {
      ciphA = matrix[r1][(c1 + 1) % 5];
      ciphB = matrix[r2][(c2 + 1) % 5];
    } else if (c1 === c2) {
      ciphA = matrix[(r1 + 1) % 5][c1];
      ciphB = matrix[(r2 + 1) % 5][c2];
    } else {
      ciphA = matrix[r1][c2];
      ciphB = matrix[r2][c1];
    }
    ciphertext += ciphA + ciphB;
  }

  let formattedCiphertext = '';
  for (let i = 0; i < ciphertext.length; i += 2) {
    formattedCiphertext += ciphertext.substring(i, i + 2) + (i + 2 < ciphertext.length ? ' ' : '');
  }

  return formattedCiphertext;
}

export function playfairDecrypt(text, key) {
  const matrix = generateMatrix(key);
  const processedText = text.toUpperCase().replace(/\s+/g, '');
  let plaintext = '';

  if (processedText.length % 2 !== 0) {
    console.error("Playfair Decryption: Ciphertext length must be even.");
    return "Invalid Ciphertext Length";
  }

  for (let i = 0; i < processedText.length; i += 2) {
    const a = processedText[i];
    const b = processedText[i + 1];

    const [r1, c1] = findPos(matrix, a);
    const [r2, c2] = findPos(matrix, b);

    if (r1 === -1 || r2 === -1) continue;

    let plainA, plainB;
    if (r1 === r2) {
      plainA = matrix[r1][(c1 + 4) % 5];
      plainB = matrix[r2][(c2 + 4) % 5];
    } else if (c1 === c2) {
      plainA = matrix[(r1 + 4) % 5][c1];
      plainB = matrix[(r2 + 4) % 5][c2];
    } else {
      plainA = matrix[r1][c2];
      plainB = matrix[r2][c1];
    }
    plaintext += plainA + plainB;
  }

  return plaintext;
}

export function getPlayfairMatrix(key) {
  return generateMatrix(key);
}
