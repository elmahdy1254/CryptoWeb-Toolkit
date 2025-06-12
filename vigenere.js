function formatKey(text, key) {
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '', j = 0;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[A-Za-z]/.test(c)) { // Fixed regex pattern
      result += key[j % key.length];
      j++;
    } else {
      result += c;
    }
  }
  return result;
}

export function vigenereEncrypt(text, key) {
  key = formatKey(text, key);
  return text.split('').map((c, i) => {
    if (!/[A-Za-z]/.test(c)) return c;
    const base = c === c.toLowerCase() ? 97 : 65;
    const shift = key[i].toUpperCase().charCodeAt(0) - 65;
    return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
  }).join('');
}

export function vigenereDecrypt(text, key) {
  key = formatKey(text, key);
  return text.split('').map((c, i) => {
    if (!/[A-Za-z]/.test(c)) return c;
    const base = c === c.toLowerCase() ? 97 : 65;
    const shift = key[i].toUpperCase().charCodeAt(0) - 65;
    return String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
  }).join('');
}
