// Function to rotate word
export function rotWord(word) {
  let tempSlot = word[0];
  word[0] = word[1];
  word[1] = word[2];
  word[2] = word[3];
  word[3] = tempSlot;

  return word;
}
