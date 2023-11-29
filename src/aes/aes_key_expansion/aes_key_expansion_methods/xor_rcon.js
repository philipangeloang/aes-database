import { Rcon } from "@/aes/constants";

// Function for xor operation in every 4th key
export function xorRcon(input, round) {
  for (let i = 0; i < 4; i++) {
    if (i == 0) {
      // the only important XOR (0x[01]00000)
      input[i] = "0x" + (input[i] ^ Rcon[round]).toString(16);
    } else {
      // all else is XORed to 00
      input[i] = "0x" + (input[i] ^ 0x00).toString(16);
    }
  }
  console.log("Round Constant XOR: ", input);
  return input;
}
