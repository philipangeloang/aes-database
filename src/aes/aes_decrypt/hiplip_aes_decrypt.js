import { InvMixColumns } from "./aes_decrypt_methods/inv_mix_columns";
import { InvShiftRows } from "./aes_decrypt_methods/inv_shift_rows";
import { InvSubBytes } from "./aes_decrypt_methods/inv_sub_bytes";
import { AddRoundKey } from "./aes_decrypt_methods/add_round_key";
import { ModifiedModSub } from "./aes_decrypt_methods/modified_mod_sub";

export function HiplipAESDecrypt(text, keys) {
  let inputText = text.match(/.{1,2}/g);
  let hexText = [];

  for (let i = 0; i < inputText.length; i++) {
    const numericValue = parseInt("0x" + inputText[i], 16);
    hexText.push("0x" + numericValue.toString(16));
  }

  function createGroups(arr, numGroups) {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups)
      .fill("")
      .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
  }

  let state = createGroups(hexText, 4); // creating a 4 by 4 state matrix from text input
  let keyCounter = 29;

  // // Start of the Encryption Algorithm
  for (let i = 10; i >= 0; i--) {
    if (i === 10) {
      // round 10 initial addroundkey
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter--;
      state = InvShiftRows(state);
      state = ModifiedModSub(state, keys[keyCounter]);
      keyCounter--;
      state = InvSubBytes(state);
    } else if (i === 0) {
      // round 0
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter--;
    } else {
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter--;
      state = InvMixColumns(state);
      state = ModifiedModSub(state, keys[keyCounter]);
      keyCounter--;
      state = InvShiftRows(state);
      state = AddRoundKey(state, keys[keyCounter]);
      keyCounter--;
      state = InvSubBytes(state);
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
