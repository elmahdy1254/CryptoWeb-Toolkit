// railfence

export function railfenceEncrypt(text, key) {
  // Rule: Ignore spaces and convert to uppercase
  const processedText = text.replace(/\s+/g, "").toUpperCase();
  const numKey = parseInt(key);

  if (!processedText || isNaN(numKey) || numKey < 2) {
    return processedText; 
  }

  const rails = Array.from({ length: numKey }, () => []);
  let rail = 0;
  let dir = 1;

  for (const char of processedText) {
    rails[rail].push(char);
    rail += dir;
    if (rail === 0 || rail === numKey - 1) {
      dir *= -1;
    }
  }

  return rails.map(r => r.join("")).join("");
}

export function railfenceDecrypt(text, key) {
  const processedText = text.toUpperCase();
  const numKey = parseInt(key);
  const len = processedText.length;

  if (!processedText || isNaN(numKey) || numKey < 2) {
    return processedText;
  }

  const railPattern = [];
  let rail = 0;
  let dir = 1;
  for (let i = 0; i < len; i++) {
    railPattern.push(rail);
    rail += dir;
    if (rail === 0 || rail === numKey - 1) {
      dir *= -1;
    }
  }

  const counts = Array(numKey).fill(0);
  for (let r of railPattern) {
    counts[r]++;
  }

  const rails = Array.from({ length: numKey }, () => []);
  let index = 0;
  for (let r = 0; r < numKey; r++) {
    rails[r] = processedText.slice(index, index + counts[r]).split("");
    index += counts[r];
  }

  let result = "";
  for (let r of railPattern) {
    if (rails[r].length > 0) {
      result += rails[r].shift();
    } else {
      console.error("Error during Rail Fence decryption: Rail empty when expected character.");
    }
  }

  return result;
}
