import { rSbox } from "@/aes/constants";

export function InvSubBytes(state) {
  // Assuming state is a 2D array representing the state matrix
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // Get the row and column indices for the S-box
      const row = (state[i][j] >>> 4) & 0x0f;
      const col = state[i][j] & 0x0f;

      // Substitute the byte using the S-box
      state[i][j] = "0x" + rSbox[row * 16 + col].toString(16);
    }
  }
  return state;
}
