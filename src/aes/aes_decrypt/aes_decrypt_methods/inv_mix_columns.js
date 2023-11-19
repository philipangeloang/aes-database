export function InvMixColumns(state) {
  function xtime(x) {
    return ((x << 1) ^ (((x >> 7) & 1) * 0x1b)) & 0xff;
  }

  function Multiply(x, y) {
    return (
      ((y & 1) * x) ^
      (((y >> 1) & 1) * xtime(x)) ^
      (((y >> 2) & 1) * xtime(xtime(x))) ^
      (((y >> 3) & 1) * xtime(xtime(xtime(x)))) ^
      (((y >> 4) & 1) * xtime(xtime(xtime(xtime(x)))))
    ); /* this last call to xtime() can be omitted */
  }

  let i;
  let a, b, c, d;
  for (i = 0; i < 4; ++i) {
    a = state[i][0];
    b = state[i][1];
    c = state[i][2];
    d = state[i][3];

    state[i][0] =
      Multiply(a, 0x0e) ^
      Multiply(b, 0x0b) ^
      Multiply(c, 0x0d) ^
      Multiply(d, 0x09);
    state[i][1] =
      Multiply(a, 0x09) ^
      Multiply(b, 0x0e) ^
      Multiply(c, 0x0b) ^
      Multiply(d, 0x0d);
    state[i][2] =
      Multiply(a, 0x0d) ^
      Multiply(b, 0x09) ^
      Multiply(c, 0x0e) ^
      Multiply(d, 0x0b);
    state[i][3] =
      Multiply(a, 0x0b) ^
      Multiply(b, 0x0d) ^
      Multiply(c, 0x09) ^
      Multiply(d, 0x0e);
  }
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      state[i][j] = "0x" + state[i][j].toString(16); // XORing byte per byte state ^ key
    }
  }

  return state;
}
