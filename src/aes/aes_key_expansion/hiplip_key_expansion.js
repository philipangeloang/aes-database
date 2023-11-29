import { xor } from "./aes_key_expansion_methods/xor";
import { xorRcon } from "./aes_key_expansion_methods/xor_rcon";
import { substituteRow } from "./aes_key_expansion_methods/row_sub_bytes";
import { rotWord } from "./aes_key_expansion_methods/rotate_word";
import { SubBytes } from "../aes_encrpyt/aes_encrypt_methods/sub_bytes";
import { ModifiedXorRcon } from "./aes_key_expansion_methods/modified_xor_rcon";
import { xorState } from "./aes_key_expansion_methods/xor_state";

export function HiplipKeyExpansion(key, n) {
  console.log("Input Key: ", key);
  let inputKey = key.match(/.{1,2}/g); // splitting input key per group of 2
  console.log("8 bit Grouping: ", inputKey);
  let hexKeys = [];

  // Converting string to hexadecimal | ae -> 0xae
  for (let i = 0; i < inputKey.length; i++) {
    const numericValue = parseInt("0x" + inputKey[i], 16);
    hexKeys.push("0x" + numericValue.toString(16));
  }

  // Grouping the hexadecimal keys firstly into 4 per word | creation of nesting
  function createGroups(arr, numGroups) {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups)
      .fill("")
      .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  }

  function combineHextoBin(state) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        state[i][j] = parseInt(state[i][j], 16).toString(2).padEnd(8, "0");
      }
    }

    for (let i = 0; i < 4; i++) {
      state[i] = state[i].join("");
    }

    return state.join("");
  }

  function combineBinToHex(state) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        state[i][j] = "0x" + parseInt(state[i][j], 2).toString(16);
      }
    }
    return state;
  }

  function binaryStringToArray(binaryString) {
    return binaryString.split("").map(Number);
  }

  function arrayToBinaryString(bitArray) {
    return bitArray.join("");
  }

  function circularLeftShift(array, shiftAmount) {
    const len = array.length;
    return array
      .slice(shiftAmount % len)
      .concat(array.slice(0, shiftAmount % len));
  }

  function circularRightShift(array, shiftAmount) {
    const len = array.length;
    return array
      .slice(len - (shiftAmount % len))
      .concat(array.slice(0, len - (shiftAmount % len)));
  }

  let expandedKeys = [];
  console.log("Main Key: ", createGroups(hexKeys, 4));

  // ith key generation
  for (let i = 0; i < n; i++) {
    let mainKey = createGroups(hexKeys, 4); // grouping keys by 4 (w0, w1, w2, w3, ...)
    let subMainKey = SubBytes(mainKey);
    let tempKey = combineHextoBin(mainKey); // Making the 4 by 4 state matrix as one combined binary value
    tempKey = binaryStringToArray(tempKey); // Separating the binary to single tokens for shifting left or right
    if ((tempKey & 1) === 1) {
      tempKey = circularLeftShift(tempKey, i + 1);
    } else {
      tempKey = circularRightShift(tempKey, i + 1);
    }
    tempKey = arrayToBinaryString(tempKey); // Converting the separated shifted array into one binary again
    tempKey = createGroups(tempKey, 16); // Grouping by 8 bits per slot
    tempKey = createGroups(tempKey, 4); // Grouping the 8 bits into 2 bits per word
    tempKey = combineBinToHex(tempKey); // Converting binary to hexadecimal value per byte

    let subTempKey = SubBytes(tempKey);
    let madeKey = xorState(subMainKey, subTempKey);
    madeKey = SubBytes(madeKey);

    expandedKeys.push(madeKey);
  }
  expandedKeys = circularLeftShift(expandedKeys, parseInt(hexKeys[0]));
  expandedKeys = circularRightShift(expandedKeys, parseInt(hexKeys[15]));

  return expandedKeys; // keys are returned as a word (w0, w1, w2, ... w44)
}
