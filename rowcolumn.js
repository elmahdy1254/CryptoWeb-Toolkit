// rowcolumn.js - Updated to handle spaces, case, and padding

export function rowEncrypt(text, key) {
  // Rule: Ignore spaces and convert to uppercase
  const processedText = text.replace(/\s+/g, "").toUpperCase();
  const keyStr = String(key);
  const cols = keyStr.length;
  const textLen = processedText.length;

  if (!processedText || !keyStr || cols === 0) {
    return processedText; // Return processed text if invalid input
  }

  const rows = Math.ceil(textLen / cols);
  const gridSize = rows * cols;
  const paddingNeeded = gridSize - textLen;

  // Rule: Apply padding with X, Y, Z...
  const paddingChars = ['X', 'Y', 'Z'];
  let paddedText = processedText;
  for (let i = 0; i < paddingNeeded; i++) {
    paddedText += paddingChars[i % 3];
  }

  // Crea\te the grid
  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (idx < paddedText.length) {
        grid[r][c] = paddedText[idx++];
      }
    }
  }

  // Get column order from key
  const order = keyStr.split("").map((k, i) => ({ k: parseInt(k), i }))
                      .sort((a, b) => a.k - b.k); // Sort by key digit

  // Read columns according to key order
  let result = "";
  for (const { i } of order) {
    for (let r = 0; r < rows; r++) {
      result += grid[r][i];
    }
  }

  return result;
}

export function rowDecrypt(text, key) {
  const processedText = text.toUpperCase();
  const keyStr = String(key);
  const cols = keyStr.length;
  const textLen = processedText.length;

  if (!processedText || !keyStr || cols === 0 || textLen === 0) {
    return processedText;
  }

  const rows = Math.ceil(textLen / cols);

  // Get column order from key
  const order = keyStr.split("").map((k, i) => ({ k: parseInt(k), i }))
                      .sort((a, b) => a.k - b.k); // Sort numerically

  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
  let index = 0;

  for (const { i } of order) {
    for (let r = 0; r < rows; r++) {
      if (index < textLen) {
        grid[r][i] = processedText[index++];
      } else {
        break;
      }
    }
  }

  let result = grid.flat().join("");
  return result;
}
