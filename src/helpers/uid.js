export function generateUid() {
  // Math.random should be unique because of its seeding algorithm.
  // To make it unique use js date object + math random to generate unique numbers
  // Its only not 100% unique if you are generating more than a million ids in a milisecond
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '' + (Date.now() + Math.random()).toString(36).substr(2, 9);
};
