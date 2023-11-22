import { ModifiedModSub } from "../aes_decrypt/aes_decrypt_methods/modified_mod_sub";
import { AddRoundKey } from "./aes_encrypt_methods/add_round_key";
import { MixColumns } from "./aes_encrypt_methods/mix_columns";
import { ModifiedModAdd } from "./aes_encrypt_methods/modified_mod_add";
import { ShiftRows } from "./aes_encrypt_methods/shift_rows";
import { SubBytes } from "./aes_encrypt_methods/sub_bytes";

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

  // console.log("Start----");
  // console.log(state);
  // state = AddRoundKey(state, keys[0]);
  // console.log(state);
  // state = SubBytes(state);
  // console.log(state);
  // state = AddRoundKey(state, keys[1]);
  // console.log(state);
  // state = ShiftRows(state);
  // console.log(state);
  // state = ModifiedModAdd(state, keys[2]);
  // console.log(state);
  // state = MixColumns(state);
  // console.log(state);
  // state = AddRoundKey(state, keys[3]);
  // console.log(state);
  // state = SubBytes(state);
  // console.log(state);
  // state = ModifiedModAdd(state, keys[4]);
  // console.log(state);
  // state = ShiftRows(state);
  // console.log(state);
  // state = AddRoundKey(state, keys[5]);
  // console.log(state);

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
