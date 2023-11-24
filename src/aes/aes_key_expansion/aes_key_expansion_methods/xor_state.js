// Function for general xor operation
export function xorState(input1, input2) {
  let newArr = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newArr[i][j] = "0x" + (input1[i][j] ^ input2[i][j]).toString(16);
    }
  }
  return newArr;
}
