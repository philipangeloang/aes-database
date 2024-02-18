import { xor } from "./aes_key_expansion_methods/xor";
import { xorRcon } from "./aes_key_expansion_methods/xor_rcon";
import { substituteRow } from "./aes_key_expansion_methods/row_sub_bytes";
import { rotWord } from "./aes_key_expansion_methods/rotate_word";
import { SubBytes } from "../aes_encrpyt/aes_encrypt_methods/sub_bytes";
import { ModifiedXorRcon } from "./aes_key_expansion_methods/modified_xor_rcon";
import { xorState } from "./aes_key_expansion_methods/xor_state";
import { allKey1, allKey2 } from "../constants";

export function ModifiedKeyExpansion(key) {
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

  let expandedKeys = createGroups(hexKeys, 4); // grouping keys by 4 (w0, w1, w2, w3, ...)

  console.log("Grouping by 4 per Word: ", createGroups(hexKeys, 4));

  // Start of Key Expansion
  expandedKeys = SubBytes(expandedKeys);
  expandedKeys = ModifiedXorRcon(expandedKeys);

  console.log("Extra Rcon Step: ", expandedKeys[3]);

  for (let i = 4; i < 120; i++) {
    let temp = [...expandedKeys[i - 1]]; // ...expandedKeys is spread to avoid referencing to one point. This is done to make new reference
    if (i % 4 === 0) {
      // this will only happen per multiple of 4 where the confusion diffusion is added
      temp = xorRcon(substituteRow(rotWord(temp)), i / 4 - 1); // i / 4 - 1 to start with round 0. XOR with confusion and diffusion
    }
    expandedKeys[i] = xor(expandedKeys[i - 4], temp); // if not multiple of 4, will XOR past and current byte
  }

  console.log("All Keys divided per Word: ", expandedKeys);
  const end = window.performance.now();
  const elapsedTime = end - start;
  console.log(`Key Expansion took ${elapsedTime} milliseconds`);

  /* FOR FREQUENCY TEST */
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
    let subKey = createGroups(expandedKeys, 30);
    let bitDiff = xorState(subKey[i], subKey[i + 1]);
    bitDiff = combineHextoBin(bitDiff);
    let count = 0;
    for (let i = 0; i < bitDiff.length; i++) {
      if (bitDiff[i] === "1") {
        count++;
      }
    }
    let n = 128;
    let Z = ((count - (count - 1)) * (count - (count - 1))) / n;

    averageFrequency = averageFrequency + count / 128;
    // console.log("Average Frequency Testers: ", Z);
    console.log(`Round ${i + 1} Relative`, count / 128);
    console.log(
      `Round ${i + 1} Score`,
      (1 - Math.abs(50 - (count / 128) * 100) / 50) * 100,
      "%"
    );
  }

  /* FOR AVALANCHE TEST */
  console.log("Avalanche Test");
  let averageAvalanche = 0;
  for (let i = 0; i < 10; i++) {
    let avalancheKey1 = allKey1[i].match(/.{1,2}/g); // splitting input key per group of 2
    let avalancheKey2 = allKey2[i].match(/.{1,2}/g); // splitting input key per group of 2
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
