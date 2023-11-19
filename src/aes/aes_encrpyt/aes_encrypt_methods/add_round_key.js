export function AddRoundKey(state, key) {
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      state[i][j] = "0x" + (state[i][j] ^ key[i][j]).toString(16); // XORing byte per byte state ^ key
    }
  }
  return state;
}
