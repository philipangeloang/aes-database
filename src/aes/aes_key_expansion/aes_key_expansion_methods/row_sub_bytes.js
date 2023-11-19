import { sBox } from "@/aes/constants";

export function substituteRow(inputRow) {
  // Iterate over each byte in the row and substitute using the S-box
  for (let i = 0; i < inputRow.length; i++) {
    const byte = inputRow[i];
    const row = (byte >>> 4) & 0x0f; //0x[a]e -> extracting upper bit | 0x0f because it is the max 16 by 16
    const col = byte & 0x0f; //0xa[e] -> extracting lower bit
    inputRow[i] = "0x" + sBox[row * 16 + col].toString(16); // getting equivalent value in sbox matrix then convert to hexadecimal
  }
  return inputRow;
}
