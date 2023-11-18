import { encrpytionData, cipherKeys, sBox, Rcon } from "./data";

export function KeyExpansion(key) {
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

  // Function to rotate word
  function rotWord(word) {
    let tempSlot = word[0];
    word[0] = word[1];
    word[1] = word[2];
    word[2] = word[3];
    word[3] = tempSlot;

    return word;
  }

  // Function to substitute and add non-linearity
  function substituteRow(inputRow) {
    // Iterate over each byte in the row and substitute using the S-box
    for (let i = 0; i < inputRow.length; i++) {
      const byte = inputRow[i];
      const row = (byte >>> 4) & 0x0f; //0x[a]e -> extracting upper bit
      const col = byte & 0x0f; //0xa[e] -> extracting lower bit
      inputRow[i] = "0x" + sBox[row * 16 + col].toString(16); // getting equivalent value in sbox matrix then convert to hexadecimal
    }
    return inputRow;
  }

  // Function for xor operation in every 4th key
  function xorRcon(input, round) {
    for (let i = 0; i < 4; i++) {
      if (i == 0) {
        // the only important XOR (0x[01]00000)
        input[i] = "0x" + (input[i] ^ Rcon[round]).toString(16);
      } else {
        // all else is XORed to 00
        input[i] = "0x" + (input[i] ^ 0x00).toString(16);
      }
    }
    return input;
  }

  // Function for general xor operation
  function xor(input1, input2) {
    let newArr = [];
    for (let i = 0; i < 4; i++) {
      // XOR byte per byte
      newArr.push("0x" + (input1[i] ^ input2[i]).toString(16));
    }
    return newArr;
  }

  let expandedKeys = createGroups(hexKeys, 4); // grouping keys by 4 (w0, w1, w2, w3, ...)

  for (let i = 4; i < 44; i++) {
    let temp = [...expandedKeys[i - 1]]; // ...expandedKeys is spread to avoid referencing to one point. This is done to make new reference
    if (i % 4 === 0) {
      // this will only happen per multiple of 4 where the confusion diffusion is added
      temp = xorRcon(substituteRow(rotWord(temp)), i / 4 - 1); // i / 4 - 1 to start with round 0. XOR with confusion and diffusion
    }
    expandedKeys[i] = xor(expandedKeys[i - 4], temp); // if not multiple of 4, will XOR past and current byte
  }

  return expandedKeys; // keys are returned as a word (w0, w1, w2, ... w44)
  // console.log(expandedKeys);
}

export function AESEncrpty(text, key) {
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

  function SubBytes(state) {
    // Assuming state is a 2D array representing the state matrix
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // Get the row and column indices for the S-box
        const row = (state[i][j] >>> 4) & 0x0f;
        const col = state[i][j] & 0x0f;

        // Substitute the byte using the S-box
        state[i][j] = "0x" + sBox[row * 16 + col].toString(16);
      }
    }
    return state;
  }

  function ShiftRows(state) {
    temp = state[0][1];
    state[0][1] = state[1][1];
    state[1][1] = state[2][1];
    state[2][1] = state[3][1];
    state[3][1] = temp;

    // Rotate second row 2 columns to left
    temp = state[0][2];
    state[0][2] = state[2][2];
    state[2][2] = temp;

    temp = state[1][2];
    state[1][2] = state[3][2];
    state[3][2] = temp;

    // Rotate third row 3 columns to left
    temp = state[0][3];
    state[0][3] = state[3][3];
    state[3][3] = state[2][3];
    state[2][3] = state[1][3];
    state[1][3] = temp;
  }

  function MixColumns(state) {
    function xtime(x) {
      return (x << 1) ^ (((x >> 7) & 1) * 0x1b);
    }

    let t, Tmp, Tm;
    for (i = 0; i < 4; ++i) {
      t = state[i][0];
      Tmp = state[i][0] ^ state[i][1] ^ state[i][2] ^ state[i][3];
      Tm = state[i][0] ^ state[i][1];
      Tm = xtime(Tm);
      state[i][0] ^= Tm ^ Tmp;
      Tm = state[i][1] ^ state[i][2];
      Tm = xtime(Tm);
      state[i][1] ^= Tm ^ Tmp;
      Tm = state[i][2] ^ state[i][3];
      Tm = xtime(Tm);
      state[i][2] ^= Tm ^ Tmp;
      Tm = state[i][3] ^ t;
      Tm = xtime(Tm);
      state[i][3] ^= Tm ^ Tmp;
    }
  }

  function AddRoundKey(state, key) {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        state[i][j] = "0x" + (state[i][j] ^ key[i][j]).toString(16); // XORing byte per byte state ^ key
      }
    }
    return state;
  }

  let state = createGroups(hexText, 4);
  let keys = createGroups(key, 11);

  // Start of the Encryption Algorithm
  for (let i = 0; i <= 10; i++) {
    if (i == 0) {
      // round 0 initial addroundkey
      state = AddRoundKey(state, keys[i]);
    }
  }
}
