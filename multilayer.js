 // multilayer.js - New Content
// Remove all cipher imports

export function multiLayerProcess(text, layers, mode, methods) { // Added 'methods' parameter
  let result = text;

  const ops = mode === 'encrypt' ? layers : layers.slice().reverse();

  for (const { algorithm, key } of ops) {
    const method = methods[algorithm];
    if (method) {
      let parsedKey = key;
      // Key parsing logic based on algorithm type
      if (algorithm === 'caesar') {
        parsedKey = parseInt(key);
        if (isNaN(parsedKey)) {
          console.error(`Invalid key \"${key}\" for Caesar cipher in multilayer processing.`);
          // Potentially throw an error or handle differently
          throw new Error(`Invalid key \"${key}\" for Caesar cipher.`); // Throw error to stop processing
        }
      } else if (algorithm === 'railfence') {
        parsedKey = parseInt(key);
        // Basic validation, although script.js should have validated already
        if (isNaN(parsedKey) || parsedKey < 2 || !Number.isInteger(parsedKey)) {
           console.error(`Invalid key \"${key}\" for Rail Fence cipher in multilayer processing.`);
           throw new Error(`Invalid key \"${key}\" for Rail Fence cipher.`); // Throw error
        }
      }
      // For other algorithms like playfair, vigenere, mono, rowcolumn, the key is expected as a string.

      try {
        result = method[mode](result, parsedKey);
      } catch (error) {
        console.error(`Error during ${mode}ion with ${algorithm} in multilayer:`, error);
        // Decide how to handle errors during processing - stop, skip, etc.
        // Throw the error up to the caller.
        throw new Error(`Error in layer ${algorithm}: ${error.message}`);
      }
    } else {
      console.warn(`Algorithm \"${algorithm}\" not found in provided methods for multilayer processing.`);
      throw new Error(`Algorithm \"${algorithm}\" not supported in multilayer processing.`); // Throw error
    }
  }
  return result;
}
