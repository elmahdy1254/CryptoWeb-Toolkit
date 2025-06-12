const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function generateMonoKey() {
  const chars = alphabet.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export function monoEncrypt(text, key) {
  const map = {};
  key = key.toUpperCase();
  for (let i = 0; i < 26; i++) {
    map[alphabet[i]] = key[i];
  }

  return text.toUpperCase().split('').map(c => {
    return alphabet.includes(c) ? map[c] : c;
  }).join('');
}

export function monoDecrypt(text, key) {
  const reverseMap = {};
  key = key.toUpperCase();
  for (let i = 0; i < 26; i++) {
    reverseMap[key[i]] = alphabet[i];
  }

  return text.toUpperCase().split('').map(c => {
    return reverseMap[c] || c;
  }).join('');
}
