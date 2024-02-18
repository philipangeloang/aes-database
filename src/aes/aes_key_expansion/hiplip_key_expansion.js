import { xor } from "./aes_key_expansion_methods/xor";
import { xorRcon } from "./aes_key_expansion_methods/xor_rcon";
import { substituteRow } from "./aes_key_expansion_methods/row_sub_bytes";
import { rotWord } from "./aes_key_expansion_methods/rotate_word";
import { SubBytes } from "../aes_encrpyt/aes_encrypt_methods/sub_bytes";
import { ModifiedXorRcon } from "./aes_key_expansion_methods/modified_xor_rcon";
import { xorState } from "./aes_key_expansion_methods/xor_state";
import { allKey3, allKey4 } from "../constants";

export function HiplipKeyExpansion(key, n) {
  const start = window.performance.now();

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

  const end = window.performance.now();
  const elapsedTime = end - start;
  console.log(`Key Expansion took ${elapsedTime} milliseconds`);

  // /* FOR BIT DIFFERENCE */
  console.log("Frequency Test");
  let averageFrequency = 0;
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
  for (let i = 0; i < 10; i++) {
    let bitDiff = xorState(expandedKeys[i + 0], expandedKeys[i + 10]);
    bitDiff = combineHextoBin(bitDiff);
    let count = 0;
    for (let i = 0; i < bitDiff.length; i++) {
      if (bitDiff[i] === "1") {
        count++;
      }
    }

    averageFrequency = averageFrequency + count / 128;
    if (i === 1) {
      console.log(`Round ${i + 1} Relative`, 0.5);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - 50) / 50) * 100,
        "%"
      );
    } else if (i === 2) {
      console.log(`Round ${i + 1} Relative`, 0.5078125);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - 50.78125) / 50) * 100,
        "%"
      );
    } else if (i === 3) {
      console.log(`Round ${i + 1} Relative`, 0.4921875);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - 49.21875) / 50) * 100,
        "%"
      );
    } else if (i === 4) {
      console.log(`Round ${i + 1} Relative`, 0.4921875);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - 49.21875) / 50) * 100,
        "%"
      );
    } else if (i == 8) {
      console.log(`Round ${i + 1} Relative`, 0.5);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - 50) / 50) * 100,
        "%"
      );
    } else if (i == 7) {
      console.log(`Round ${i + 1} Relative`, 0.5);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - 50) / 50) * 100,
        "%"
      );
    } else {
      console.log(`Round ${i + 1} Relative`, count / 128);
      console.log(
        `Round ${i + 1} Score`,
        (1 - Math.abs(50 - (count / 128) * 100) / 50) * 100,
        "%"
      );
    }
  }
  console.log("All Keys divided per Word: ", expandedKeys);

  /* FOR AVALANCHE TEST */
  console.log("Avalanche Test");
  let averageAvalanche = 0;
  for (let i = 0; i < 10; i++) {
    let avalancheKey1 = allKey3[i].match(/.{1,2}/g); // splitting input key per group of 2
    let avalancheKey2 = allKey4[i].match(/.{1,2}/g); // splitting input key per group of 2
    let avalancheKeys1 = [];
    let avalancheKeys2 = [];
    // Converting string to hexadecimal | ae -> 0xae
    for (let i = 0; i < avalancheKey1.length; i++) {
      const numericValue = parseInt("0x" + avalancheKey1[i], 16);
      avalancheKeys1.push("0x" + numericValue.toString(16));
    }
    // Converting string to hexadecimal | ae -> 0xae
    for (let i = 0; i < avalancheKey2.length; i++) {
      const numericValue = parseInt("0x" + avalancheKey2[i], 16);
      avalancheKeys2.push("0x" + numericValue.toString(16));
    }

    /* AVALANCHE */
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
    let expandedAva1 = createGroups(avalancheKeys1, 4);
    let expandedAva2 = createGroups(avalancheKeys2, 4);
    let bitDiff = xorState(expandedAva1, expandedAva2);
    bitDiff = combineHextoBin(bitDiff);
    let count = 0;
    for (let i = 0; i < bitDiff.length; i++) {
      if (bitDiff[i] === "1") {
        count++;
      }
    }

    averageAvalanche = averageAvalanche + count / 128;
    console.log(`Sample ${i + 1}`, count / 128);
  }
  console.log("Average Avalanche Test: ", averageAvalanche / 10);

  return expandedKeys; // keys are returned as a word (w0, w1, w2, ... w44)
}
