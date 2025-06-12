import { caesarEncrypt, caesarDecrypt } from './caesar.js';
import { monoEncrypt, monoDecrypt, generateMonoKey } from './monoalphabetic.js';
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix } from './playfair.js';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere.js';
import { railfenceEncrypt as railFenceEncrypt, railfenceDecrypt as railFenceDecrypt } from './railfence.js';
import { rowEncrypt as rowColumnEncrypt, rowDecrypt as rowColumnDecrypt } from './rowcolumn.js';
import { multiLayerProcess } from './multilayer.js';

const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
// Remove modeSelect, add button references
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const multiLayerCheckbox = document.getElementById('multiLayer');
const singleLayerContainer = document.getElementById('singleLayerContainer');
const layersContainer = document.getElementById('layersContainer');
const processBtn = document.getElementById('processBtn');
const matrixDisplay = document.getElementById('matrixDisplay');
const playfairMatrix = document.getElementById('playfairMatrix');

// Single layer controls
const algoSelect = document.getElementById('algo');
const keyInputDiv = document.getElementById('keyInputDiv');
const keyInput = document.getElementById('keyInput');
const generateKeyBtn = document.getElementById('generateKey');

// State variable for mode
let currentMode = 'encrypt'; // Default to encrypt

const algorithmsInfo = {
  caesar: { needsKey: true, generateKey: false, keyPlaceholder: "Enter a number (shift)" },
  mono: { needsKey: true, generateKey: true, keyPlaceholder: "26 letters key (A-Z)" },
  playfair: { needsKey: true, generateKey: false, keyPlaceholder: "Keyword (letters only)" },
  vigenere: { needsKey: true, generateKey: false, keyPlaceholder: "Keyword (letters only)" },
  railfence: { needsKey: true, generateKey: false, keyPlaceholder: "Number of rails (≥2)" },
  rowcolumn: { needsKey: true, generateKey: false, keyPlaceholder: "Numbers only (e.g., 312)" },
};

const cipherMethods = {
  caesar: { encrypt: caesarEncrypt, decrypt: caesarDecrypt },
  mono: { encrypt: monoEncrypt, decrypt: monoDecrypt },
  playfair: { encrypt: playfairEncrypt, decrypt: playfairDecrypt },
  vigenere: { encrypt: vigenereEncrypt, decrypt: vigenereDecrypt },
  railfence: { encrypt: railFenceEncrypt, decrypt: railFenceDecrypt },
  rowcolumn: { encrypt: rowColumnEncrypt, decrypt: rowColumnDecrypt }
};

// VALIDATION FUNCTIONS (Keep existing validation functions)
const validateVigenereKey = (key) => {
  if (!/^[A-Za-z]+$/.test(key)) {
    alert('Vigenère key must contain only letters');
    return false;
  }
  return true;
};

const validateMonoKey = (key) => {
  if (key.length !== 26 || !/^[A-Za-z]{26}$/i.test(key)) {
    alert('Monoalphabetic key must be exactly 26 letters');
    return false;
  }
  const unique = new Set(key.toUpperCase().split(''));
  if (unique.size !== 26) {
    alert('Monoalphabetic key must have unique letters');
    return false;
  }
  return true;
};

const validateRowColumnKey = (key) => {
  if (!/^\d+$/.test(key)) {
    alert('Row-Column key must contain only numbers');
    return false;
  }
  return true;
};

const validateRailFenceKey = (key) => {
  const num = parseInt(key);
  if (isNaN(num) || num < 2 || !Number.isInteger(num)) {
    alert('Rail Fence key must be integer ≥ 2');
    return false;
  }
  return true;
};

// Event listeners for mode buttons
encryptBtn.addEventListener('click', () => {
  if (currentMode !== 'encrypt') {
    currentMode = 'encrypt';
    encryptBtn.classList.add('active');
    decryptBtn.classList.remove('active');
    // Optional: Clear output or update based on new mode if needed immediately
    // outputText.value = '';
  }
});

decryptBtn.addEventListener('click', () => {
  if (currentMode !== 'decrypt') {
    currentMode = 'decrypt';
    decryptBtn.classList.add('active');
    encryptBtn.classList.remove('active');
    // Optional: Clear output or update based on new mode if needed immediately
    // outputText.value = '';
  }
});

algoSelect.addEventListener('change', () => {
  const algo = algoSelect.value;
  matrixDisplay.style.display = 'none';
  if (!algo || !algorithmsInfo[algo]) {
    keyInputDiv.style.display = 'none';
    generateKeyBtn.style.display = 'none';
    return;
  }
  keyInputDiv.style.display = 'block';
  keyInput.placeholder = algorithmsInfo[algo].keyPlaceholder || 'Enter Key...';
  keyInput.value = '';
  generateKeyBtn.style.display = algorithmsInfo[algo].generateKey ? 'inline-block' : 'none';
});

generateKeyBtn.addEventListener('click', () => {
  if (algoSelect.value === 'mono') {
    const randomKey = generateMonoKey();
    keyInput.value = randomKey;
  }
});

multiLayerCheckbox.addEventListener('change', () => {
  matrixDisplay.style.display = 'none';
  if (multiLayerCheckbox.checked) {
    singleLayerContainer.style.display = 'none';
    layersContainer.style.display = 'block';
    generateLayerControls();
  } else {
    singleLayerContainer.style.display = 'block';
    layersContainer.style.display = 'none';
    layersContainer.innerHTML = '';
  }
});

function generateLayerControls() {
  layersContainer.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'layer';
    const label = document.createElement('label');
    label.textContent = `Layer ${i} Algorithm: `;
    label.setAttribute('for', `layerAlgo${i}`);
    const select = document.createElement('select');
    select.id = `layerAlgo${i}`;
    select.name = `layerAlgo${i}`;
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '--Select--';
    select.appendChild(emptyOption);
    for (const [key, info] of Object.entries(algorithmsInfo)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      select.appendChild(option);
    }
    const keyDiv = document.createElement('div');
    keyDiv.className = 'layerKeyDiv';
    keyDiv.style.display = 'none';
    const keyLabel = document.createElement('label');
    keyLabel.textContent = `Layer ${i} Key: `;
    keyLabel.setAttribute('for', `layerKey${i}`);
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.id = `layerKey${i}`;
    keyInput.name = `layerKey${i}`;
    keyInput.placeholder = 'Enter Key...';
    const genKeyBtn = document.createElement('button');
    genKeyBtn.type = 'button';
    genKeyBtn.textContent = 'Generate Random Key';
    genKeyBtn.style.display = 'none';
    genKeyBtn.addEventListener('click', () => {
      if (select.value === 'mono') {
        keyInput.value = generateMonoKey();
      }
    });
    keyDiv.appendChild(keyLabel);
    keyDiv.appendChild(keyInput);
    keyDiv.appendChild(genKeyBtn);
    select.addEventListener('change', () => {
      const selectedAlgo = select.value;
      if (!selectedAlgo) {
        keyDiv.style.display = 'none';
        return;
      }
      keyDiv.style.display = 'block';
      const info = algorithmsInfo[selectedAlgo];
      keyInput.placeholder = info.keyPlaceholder || 'Enter Key...';
      keyInput.value = '';
      genKeyBtn.style.display = info.generateKey ? 'inline-block' : 'none';
    });
    layerDiv.appendChild(label);
    layerDiv.appendChild(select);
    layerDiv.appendChild(keyDiv);
    layersContainer.appendChild(layerDiv);
  }
}

// runCipher remains for single layer processing
function runCipher(algo, mode, text, key) {
  if (!algo) return text;
  switch (algo) {
    case 'caesar':
      return mode === 'encrypt' ? caesarEncrypt(text, parseInt(key)) : caesarDecrypt(text, parseInt(key));
    case 'mono':
      return mode === 'encrypt' ? monoEncrypt(text, key) : monoDecrypt(text, key);
    case 'playfair':
      const matrix = getPlayfairMatrix(key);
      matrixDisplay.style.display = 'block';
      playfairMatrix.textContent = matrix.map(row => row.join(' ')).join('\n');
      return mode === 'encrypt' ? playfairEncrypt(text, key) : playfairDecrypt(text, key);
    case 'vigenere':
      return mode === 'encrypt' ? vigenereEncrypt(text, key) : vigenereDecrypt(text, key);
    case 'railfence':
      const rails = parseInt(key);
      if (isNaN(rails) || rails < 2) {
          alert('Invalid Rail Fence key: must be an integer >= 2');
          return text; // Return original text on invalid key
      }
      return mode === 'encrypt' ? railFenceEncrypt(text, rails) : railFenceDecrypt(text, rails);
    case 'rowcolumn':
      return mode === 'encrypt' ? rowColumnEncrypt(text, key) : rowColumnDecrypt(text, key);
    default:
      return text;
  }
}

processBtn.addEventListener('click', () => {
  matrixDisplay.style.display = 'none';
  const mode = currentMode; // Use the state variable
  const text = inputText.value.trim();

  if (multiLayerCheckbox.checked) {
    const layers = [];
    for (let i = 1; i <= 3; i++) {
      const algoSelect = document.getElementById(`layerAlgo${i}`);
      const keyInput = document.getElementById(`layerKey${i}`);
      if (algoSelect?.value) {
        layers.push({
          algorithm: algoSelect.value,
          key: keyInput.value.trim(),
        });
      }
    }

    if (layers.length === 0) {
      alert('Please select at least one layer');
      return;
    }

    // Validate all layers before processing
    for (const layer of layers) {
      const key = layer.key;
      if (algorithmsInfo[layer.algorithm].needsKey && !key) {
        alert(`Missing key for ${layer.algorithm} in layer configuration`);
        return;
      }
      switch (layer.algorithm) {
        case 'vigenere': if (!validateVigenereKey(key)) return; break;
        case 'mono': if (!validateMonoKey(key)) return; break;
        case 'railfence': if (!validateRailFenceKey(key)) return; break;
        case 'rowcolumn': if (!validateRowColumnKey(key)) return; break;
        case 'caesar':
          if (isNaN(parseInt(key))) {
            alert('Caesar key must be a number');
            return;
          }
          break;
        // Playfair key validation happens within its functions
      }
    }

    // Call the refactored multiLayerProcess
    try {
        // Check if any layer is Playfair to potentially show the matrix
        let playfairLayerIndex = -1;
        const ops = mode === 'encrypt' ? layers : layers.slice().reverse();
        ops.forEach((layer, index) => {
            if (layer.algorithm === 'playfair') {
                playfairLayerIndex = index; // Keep track of the last (encrypt) or first (decrypt) Playfair layer
            }
        });

        const result = multiLayerProcess(text, layers, mode, cipherMethods);
        outputText.value = result;

        // Show Playfair matrix if applicable (after processing)
        if (playfairLayerIndex !== -1) {
            const playfairLayer = ops[playfairLayerIndex];
            const matrix = getPlayfairMatrix(playfairLayer.key);
            matrixDisplay.style.display = 'block';
            playfairMatrix.textContent = matrix.map(row => row.join(' ')).join('\n');
        } else {
             matrixDisplay.style.display = 'none'; // Ensure it's hidden if no Playfair layer was used
        }

    } catch (error) {
      console.error("Error during multi-layer processing:", error);
      alert(`Error processing layers: ${error.message}`);
    }

  } else {
    // Single layer processing
    const algo = algoSelect.value;
    const key = keyInput.value.trim();

    if (!algo) {
      alert('Select an algorithm first');
      return;
    }

    if (algorithmsInfo[algo].needsKey && !key) {
      alert('Key is required for this algorithm');
      return;
    }

    // Single layer validation
    switch (algo) {
      case 'vigenere': if (!validateVigenereKey(key)) return; break;
      case 'mono': if (!validateMonoKey(key)) return; break;
      case 'railfence': if (!validateRailFenceKey(key)) return; break;
      case 'rowcolumn': if (!validateRowColumnKey(key)) return; break;
      case 'caesar':
        if (isNaN(parseInt(key))) {
          alert('Caesar key must be a number');
          return;
        }
        break;
      // Playfair key validation happens within its functions
    }

    // Use runCipher for single layer
    try {
        outputText.value = runCipher(algo, mode, text, key);
    } catch (error) {
        console.error(`Error during single layer ${algo} processing:`, error);
        alert(`Error processing with ${algo}: ${error.message}`);
    }
  }
});

