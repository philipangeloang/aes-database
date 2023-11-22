export function ModifiedModAdd(input, key) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      input[i][j] =
        "0x" +
        ((parseInt(input[i][j]) + parseInt(key[i][j])) % 256).toString(16);
    }
  }

  return input;
}
