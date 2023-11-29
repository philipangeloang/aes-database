// Function for xor operation before main expansion
export function ModifiedXorRcon(input) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      input[i][j] =
        "0x" +
        (
          parseInt(input[i][j], 16) ^
          parseInt(input[i][i] + (i + 2) * 2 - 1, 16) % 32
        ).toString(16);
    }
  }

  return input;
}
