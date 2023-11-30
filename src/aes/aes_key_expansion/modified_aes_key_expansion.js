import { xor } from "./aes_key_expansion_methods/xor";
import { xorRcon } from "./aes_key_expansion_methods/xor_rcon";
import { substituteRow } from "./aes_key_expansion_methods/row_sub_bytes";
import { rotWord } from "./aes_key_expansion_methods/rotate_word";
import { SubBytes } from "../aes_encrpyt/aes_encrypt_methods/sub_bytes";
import { ModifiedXorRcon } from "./aes_key_expansion_methods/modified_xor_rcon";
import calculateCorrelation from "calculate-correlation";
import { xorState } from "./aes_key_expansion_methods/xor_state";

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

  let key1 = "657a3896ee3793e87681adb9f5de1ee6";
  let key2 = "d17b386add165f75ba676a6289e716b1";

  let avalancheKey1 = key1.match(/.{1,2}/g); // splitting input key per group of 2
  let avalancheKey2 = key2.match(/.{1,2}/g); // splitting input key per group of 2
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

  console.log(expandedAva1);
  console.log(expandedAva2);

  let bitDiff = xorState(expandedAva1, expandedAva2);

  bitDiff = combineHextoBin(bitDiff);
  let count = 0;
  for (let i = 0; i < bitDiff.length; i++) {
    if (bitDiff[i] === "1") {
      count++;
    }
  }
  console.log("Herere", count / 128);

  /* FOR BIT DIFFERENCE */
  // function combineHextoBin(state) {
  //   for (let i = 0; i < 4; i++) {
  //     for (let j = 0; j < 4; j++) {
  //       state[i][j] = parseInt(state[i][j], 16).toString(2).padEnd(8, "0");
  //     }
  //   }

  //   for (let i = 0; i < 4; i++) {
  //     state[i] = state[i].join("");
  //   }

  //   return state.join("");
  // }

  // for (let i = 0; i < 10; i++) {
  //   let subKey = createGroups(expandedKeys, 30);
  //   let bitDiff = xorState(subKey[i], subKey[i + 1]);
  //   bitDiff = combineHextoBin(bitDiff);
  //   let count = 0;
  //   for (let i = 0; i < bitDiff.length; i++) {
  //     if (bitDiff[i] === "1") {
  //       count++;
  //     }
  //   }
  //   console.log("Herere", count / 128);
  // }

  /* FOR CORRELATION COEFFICIENT */
  // let pearsonValues = [];
  // let allKeysPerFour = createGroups(expandedKeys, 30);
  // let mainKeyPerFour = createGroups(hexKeys, 4);
  // for (let i = 0; i < allKeysPerFour.length; i++) {
  //   for (let j = 0; j < 4; j++) {
  //     mainKeyPerFour[j] = parseInt(mainKeyPerFour[j], 16);
  //     allKeysPerFour[i][j] = parseInt(allKeysPerFour[i][j], 16);
  //   }
  // }

  // // Correlation Coefficient Tests
  // for (let i = 0; i < allKeysPerFour.length; i++) {
  //   const correlation = calculateCorrelation(mainKeyPerFour, allKeysPerFour[i]);
  //   pearsonValues.push(correlation);
  // }

  // let non = 0;
  // let weak = 0;
  // let moderate = 0;
  // let strong = 0;
  // let perfect = 0;

  // for (let i = 0; i < pearsonValues.length; i++) {
  //   if (pearsonValues[i] === 0) {
  //     non++;
  //   } else if (
  //     (pearsonValues[i] > 0 && pearsonValues[i] <= 0.3) ||
  //     (pearsonValues[i] >= -0.3 && pearsonValues[i] < 0)
  //   ) {
  //     weak++;
  //   } else if (
  //     (pearsonValues[i] > 0.3 && pearsonValues[i] < 0.7) ||
  //     (pearsonValues[i] > -0.7 && pearsonValues[i] < -0.3)
  //   ) {
  //     moderate++;
  //   } else if (
  //     (pearsonValues[i] >= 0.7 && pearsonValues[i] < 1) ||
  //     (pearsonValues[i] > -1 && pearsonValues[i] <= -0.7)
  //   ) {
  //     strong++;
  //   } else if (pearsonValues[i] === 1 || pearsonValues[i] === -1) {
  //     perfect++;
  //   }
  // }

  // console.log("non: ", non);
  // console.log("weak: ", weak);
  // console.log("moderate: ", moderate);
  // console.log("strong: ", strong);
  // console.log("perfect: ", perfect);

  // console.log(pearsonValues);

  return expandedKeys; // keys are returned as a word (w0, w1, w2, ... w44)
}
