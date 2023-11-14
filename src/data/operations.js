import { encrpytionData, cipherKeys, sBox, Rcon } from "./data";

export function keyExpansion(key) {
  // 0f1571c947d9e8590cb7add6af7f6798
  let inputKey = key.match(/.{1,2}/g);
  let hexKeys = [];

  // Converting string to hexadecimal
  for (let i = 0; i < inputKey.length; i++) {
    const numericValue = parseInt("0x" + inputKey[i], 16);
    hexKeys.push("0x" + numericValue.toString(16));
  }

  // Grouping the hexadecimal keys firstly into 4 per word
  function createGroups(arr, numGroups) {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups)
      .fill("")
      .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  }

  // Function to rotate word
  function rotWord(word) {
    let tempSlot = word[0];
    word[0] = word[1];
    word[1] = word[2];
    word[2] = word[3];
    word[3] = tempSlot;

    return word;
  }

  // Function to substitute and add non-linearity
  function substituteRow(inputRow) {
    // Iterate over each byte in the row and substitute using the S-box
    for (let i = 0; i < inputRow.length; i++) {
      const byte = inputRow[i];
      const row = (byte >>> 4) & 0x0f;
      const col = byte & 0x0f;
      inputRow[i] = "0x" + sBox[row * 16 + col].toString(16);
    }
    return inputRow;
  }

  // Function for xor operation in every 4th key
  function xorRcon(input, round) {
    for (let i = 0; i < 4; i++) {
      if (i == 0) {
        input[i] = "0x" + (input[i] ^ Rcon[round]).toString(16);
      } else {
        input[i] = "0x" + (input[i] ^ 0x00).toString(16);
      }
    }
    return input;
  }

  // Function for general xor operation
  function xor(input1, input2) {
    let newArr = [];
    for (let i = 0; i < 4; i++) {
      newArr.push("0x" + (input1[i] ^ input2[i]).toString(16));
    }
    return newArr;
  }

  let expandedKeys = createGroups(hexKeys, 4);

  for (let i = 4; i < 44; i++) {
    let temp = [...expandedKeys[i - 1]];
    if (i % 4 === 0) {
      temp = xorRcon(substituteRow(rotWord(temp)), i / 4);
    }
    expandedKeys[i] = xor(expandedKeys[i - 4], temp);
  }

  console.log(expandedKeys);
}
