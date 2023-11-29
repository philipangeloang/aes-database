// Function for general xor operation
export function xor(input1, input2) {
  let newArr = [];
  for (let i = 0; i < 4; i++) {
    // XOR byte per byte
    newArr.push("0x" + (input1[i] ^ input2[i]).toString(16));
  }
  console.log("Previous and Current Word XOR: ", newArr);
  return newArr;
}
