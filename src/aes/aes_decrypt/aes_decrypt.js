import { InvMixColumns } from "./aes_decrypt_methods/inv_mix_columns";
import { InvShiftRows } from "./aes_decrypt_methods/inv_shift_rows";
import { InvSubBytes } from "./aes_decrypt_methods/inv_sub_bytes";
import { AddRoundKey } from "./aes_decrypt_methods/add_round_key";

export function AESDecrypt(text, key) {
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
  let keys = createGroups(key, 11); // grouping the keys per round (round 0 to 10 | total of 11 rounds)

  // Start of the Encryption Algorithm
  for (let i = 10; i >= 0; i--) {
    if (i === 10) {
      // round 10 initial addroundkey
      state = AddRoundKey(state, keys[i]);
    } else if (i === 0) {
      // round 0
      state = InvShiftRows(state);
      state = InvSubBytes(state);
      state = AddRoundKey(state, keys[i]);
    } else {
      state = InvShiftRows(state);
      state = InvSubBytes(state);
      state = AddRoundKey(state, keys[i]);
      state = InvMixColumns(state);
    }
  }
  return state;
}
