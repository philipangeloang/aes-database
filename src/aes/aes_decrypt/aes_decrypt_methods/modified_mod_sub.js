export function ModifiedModSub(input, key) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if ((parseInt(input[i][j]) - parseInt(key[i][j])) % 256 < 0) {
        // This is done if the minuend < subtrahend to avoid negative values. It needs borrowing which explicitly needed to be coded
        input[i][j] =
          "0x" + (parseInt(input[i][j]) + parseInt(0x100)).toString(16);
      }

      input[i][j] =
        "0x" +
        ((parseInt(input[i][j]) - parseInt(key[i][j])) % 256).toString(16);
    }
  }

  return input;
}
