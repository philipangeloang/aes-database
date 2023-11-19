export function MixColumns(state) {
  function xtime(x) {
    return ((x << 1) ^ (((x >> 7) & 1) * 0x1b)) & 0xff;
  }

  let t, Tmp, Tm;
  for (let i = 0; i < 4; ++i) {
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
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      state[i][j] = "0x" + state[i][j].toString(16); // XORing byte per byte state ^ key
    }
  }

  return state;
}
