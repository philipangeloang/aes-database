// Function for general xor operation
export function xorState(input1, input2) {
  let newArr = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newArr[i][j] = "0x" + (input1[i] ^ input2[i]).toString(16);
    }
  }
  return newArr;
}
