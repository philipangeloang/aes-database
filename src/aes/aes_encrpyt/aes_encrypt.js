import { AddRoundKey } from "./aes_encrypt_methods/add_round_key";
import { MixColumns } from "./aes_encrypt_methods/mix_columns";
import { ShiftRows } from "./aes_encrypt_methods/shift_rows";
import { SubBytes } from "./aes_encrypt_methods/sub_bytes";

export function AESEncrypt(text, key) {
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
  let keys = createGroups(key, 11); // grouping the keys per round (round 0 to 10 | total of 11 rounds)

  // Start of the Encryption Algorithm
  for (let i = 0; i <= 10; i++) {
    if (i === 0) {
      // round 0 initial addroundkey
      state = AddRoundKey(state, keys[i]);
    } else if (i === 10) {
      // round 10
      state = SubBytes(state);
      state = ShiftRows(state);
      state = AddRoundKey(state, keys[i]);
    } else {
      state = SubBytes(state);
      state = ShiftRows(state);
      state = MixColumns(state);
      state = AddRoundKey(state, keys[i]);
    }
  }

  // Extra step to ensure the output is in string
  let returningState = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = parseInt(state[i][j])
        .toString(16)
        .padStart(2, "0")
        .join(""); //removing 0x, ensuring trailing zeros are all taken care of and converted to string
      returningState.push(state[i][j]);
    }
  }

  return returningState;
}
