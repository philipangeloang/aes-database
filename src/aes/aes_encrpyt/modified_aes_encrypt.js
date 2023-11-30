import { ModifiedModSub } from "../aes_decrypt/aes_decrypt_methods/modified_mod_sub";
import { AddRoundKey } from "./aes_encrypt_methods/add_round_key";
import { MixColumns } from "./aes_encrypt_methods/mix_columns";
import { ModifiedModAdd } from "./aes_encrypt_methods/modified_mod_add";
import { ShiftRows } from "./aes_encrypt_methods/shift_rows";
import { SubBytes } from "./aes_encrypt_methods/sub_bytes";
import calculateCorrelation from "calculate-correlation";

export function ModifiedAESEncrypt(text, key) {
  let inputText = text.match(/.{1,2}/g);
  let hexText = [];

  // Converting string to hexadecimal | ae -> 0xae
  for (let i = 0; i < inputText.length; i++) {
    const numericValue = parseInt("0x" + inputText[i], 16);
    hexText.push("0x" + numericValue.toString(16));
  }

  // Grouping the text input to create a 4 by 4 state matrix
  function createGroups(arr, numGroups) {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups)
      .fill("")
      .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  }

  let state = createGroups(hexText, 4); // creating a 4 by 4 state matrix from text input
  let keys = createGroups(key, 30); // grouping the keys per round (round 0 to 10 | total of 11 rounds)
  let keyCounter = 0;

  // Start of the Encryption Algorithm
  for (let i = 0; i <= 10; i++) {
    if (i === 0) {
      // round 0 initial addroundkey
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter++;
    } else if (i === 10) {
      // round 10
      state = SubBytes(state);
      state = ModifiedModAdd(state, keys[keyCounter]);
      keyCounter++;
      state = ShiftRows(state);
      state = AddRoundKey(state, keys[keyCounter]);
    } else {
      state = SubBytes(state);
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter++;
      state = ShiftRows(state);
      state = ModifiedModAdd(state, keys[keyCounter]);
      keyCounter++;
      state = MixColumns(state);
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter++;
    }
  }

  /* FOR CORRELATION COEFFICIENT  */
  console.log("Correlation Coefficient Test");
  let orig = createGroups(hexText, 4);
  let cipher = state;
  let pearsonValues = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      orig[i][j] = parseInt(orig[i][j], 16);
      cipher[i][j] = parseInt(cipher[i][j], 16);
    }
  }

  for (let i = 0; i < 4; i++) {
    const correlation = calculateCorrelation(orig[i], cipher[i]);
    pearsonValues.push(correlation);
  }

  let non = 0;
  let weak = 0;
  let moderate = 0;
  let strong = 0;
  let perfect = 0;

  for (let i = 0; i < pearsonValues.length; i++) {
    if (pearsonValues[i] === 0) {
      non++;
    } else if (
      (pearsonValues[i] > 0 && pearsonValues[i] <= 0.3) ||
      (pearsonValues[i] >= -0.3 && pearsonValues[i] < 0)
    ) {
      weak++;
    } else if (
      (pearsonValues[i] > 0.3 && pearsonValues[i] < 0.7) ||
      (pearsonValues[i] > -0.7 && pearsonValues[i] < -0.3)
    ) {
      moderate++;
    } else if (
      (pearsonValues[i] >= 0.7 && pearsonValues[i] < 1) ||
      (pearsonValues[i] > -1 && pearsonValues[i] <= -0.7)
    ) {
      strong++;
    } else if (pearsonValues[i] === 1 || pearsonValues[i] === -1) {
      perfect++;
    }
  }

  console.log("non: ", non);
  console.log("weak: ", weak);
  console.log("moderate: ", moderate);
  console.log("strong: ", strong);
  console.log("perfect: ", perfect);

  console.log(pearsonValues);

  // Extra step to ensure the output is in string
  let returningState = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = parseInt(state[i][j]).toString(16).padStart(2, "0"); //removing 0x and ensuring trailing zeros are taken care
      returningState.push(state[i][j]);
    }
  }

  return returningState.join("");
}
