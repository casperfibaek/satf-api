/*
  A series of input validators for the API.
*/

/**
 * Check if an input string is a valid Pluscode address
 * @param {string} str Potential pluscode.
 * @return {boolean} True if valid pluscode, false otherwise.
 */
export function isValidPluscode(code:any) {
  // A separator used to break the code into two parts to aid memorability.
  const seperator = '+';

  // The number of characters to place before the separator.
  const seperatorPosition = 8;

  // The character used to pad codes.
  const paddingCharacter = '0';

  // The character set used to encode the values.
  const codeAlphabet = '23456789CFGHJMPQRVWX';

  if (!code || typeof code !== 'string') {
    return false;
  }
  // The separator is required.
  if (code.indexOf(seperator) === -1) {
    return false;
  }
  if (code.indexOf(seperator) !== code.lastIndexOf(seperator)) {
    return false;
  }
  // Is it the only character?
  if (code.length === 1) {
    return false;
  }
  // Is it in an illegal position?
  if (code.indexOf(seperator) > seperatorPosition || code.indexOf(seperator) % 2 === 1) {
    return false;
  }
  // We can have an even number of padding characters before the separator,
  // but then it must be the final character.
  if (code.indexOf(paddingCharacter) > -1) {
    // Not allowed to start with them!
    if (code.indexOf(paddingCharacter) === 0) {
      return false;
    }
    // There can only be one group and it must have even length.
    const padMatch = code.match(new RegExp(`(${paddingCharacter}+)`, 'g'));
    if (
      padMatch.length > 1 || padMatch[0].length % 2 === 1 || padMatch[0].length > seperatorPosition - 2
    ) {
      return false;
    }
    // If the code is long enough to end with a separator, make sure it does.
    if (code.charAt(code.length - 1) !== seperator) {
      return false;
    }
  }
  // If there are characters after the separator, make sure there isn't just
  // one of them (not legal).
  if (code.length - code.indexOf(seperator) - 1 === 1) {
    return false;
  }

  // Strip the separator and any padding characters.
  const nosepCode = code.replace(new RegExp(`\\${seperator}+`), '').replace(new RegExp(`${paddingCharacter}+`), '');
  // Check the code contains only valid characters.
  for (let i = 0, len = nosepCode.length; i < len; i += 1) {
    const character = nosepCode.charAt(i).toUpperCase();
    if (character !== seperator && codeAlphabet.indexOf(character) === -1) {
      return false;
    }
  }
  return true;
}

/**
 * Check if an input string is a valid What3words address
 * @param {string} str Potential What3words address.
 * @return {boolean} True if valid what3words, false otherwise.
 */
export function isValidWhatFreeWords(str:any) {
  if (typeof str !== 'string') { return false; }
  if (str.split('.').length !== 3) { return false; }
  if (/^[a-zA-Z.]+$/.test(str) === false) { return false; }

  return true;
}


/**
 * Check if an input number is a valid latitude coordinate reference.
 * @param {number} str Potential latitude coordinate.
 * @return {boolean} True if valid latitude, false otherwise.
 */
export function isValidLatitude(lat:any) {
  const number = Number(lat);
  try {
    if (isNaN(number)) { return false; }
    if (number < -90 || number > 90) { return false; }
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if an input number is a valid longitude coordinate reference.
 * @param {number} str Potential longitude coordinate.
 * @return {boolean} True if valid longitude, false otherwise.
 */
export function isValidLongitude(lat:any) {
  const number = Number(lat);
  try {
    if (isNaN(number)) { return false; }
    if (number < -180 || number > 180) { return false; }
    return true;
  } catch {
    return false;
  }
}
