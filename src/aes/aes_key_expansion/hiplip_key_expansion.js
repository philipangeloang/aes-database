import { xor } from "./aes_key_expansion_methods/xor";
import { xorRcon } from "./aes_key_expansion_methods/xor_rcon";
import { substituteRow } from "./aes_key_expansion_methods/row_sub_bytes";
import { rotWord } from "./aes_key_expansion_methods/rotate_word";
import { SubBytes } from "../aes_encrpyt/aes_encrypt_methods/sub_bytes";
import { ModifiedXorRcon } from "./aes_key_expansion_methods/modified_xor_rcon";

export function HiplipKeyExpansion(key, n) {
  let inputKey = key.match(/.{1,2}/g); // splitting input key per group of 2
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

  function binaryStringToArray(binaryString) {
    return binaryString.split("").map(Number);
  }

  function arrayToBinaryString(bitArray) {
    return bitArray.join("");
  }

  function leftShift(array, shiftAmount) {
    return array.slice(shiftAmount).concat(new Array(shiftAmount).fill(0));
  }

  function rightShift(array, shiftAmount) {
    return new Array(shiftAmount)
      .fill(0)
      .concat(array.slice(0, array.length - shiftAmount));
  }

  let mainKey = createGroups(hexKeys, 4); // grouping keys by 4 (w0, w1, w2, w3, ...)
  let subMainKey = SubBytes(mainKey);
  let expandedKeys = [];

  // ith key generation
  for (let i = 0; i < n; i++) {
    let tempKey = combineHextoBin(mainKey);
    tempKey = binaryStringToArray(tempKey);
    if ((tempKey & 1) === 1) {
      tempKey = leftShift(tempKey, i + 1);
    } else {
      tempKey = rightShift(tempKey, i + 1);
    }
    tempKey = arrayToBinaryString(tempKey);
    tempKey = createGroups(tempKey, 16);
    tempKey = createGroups(tempKey, 4);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        tempKey[i][j] = "0x" + parseInt(tempKey[i][j], 2).toString(16);
      }
    }

    let subTempKey = SubBytes(tempKey);
    let madeKey = xor(subMainKey, subTempKey);
    console.log(madeKey);
    madeKey = SubBytes(madeKey);

    expandedKeys.push(madeKey);
  }

  console.log(expandedKeys);
  return expandedKeys; // keys are returned as a word (w0, w1, w2, ... w44)
}
